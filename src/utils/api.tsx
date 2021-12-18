import { firebaseAuth, googleAuthProvider, firestoreDb, firebaseStorage } from './firebase';
import { IUserData, IUserDrawData, IDrawDataFromFirestoreType, IStripeUserData, IUserOrderObject, ITransactionFirestoreObject } from './types'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
   signInWithPopup, updateProfile, User,
} from 'firebase/auth';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, Timestamp, DocumentData } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';

export const TEST_BACKEND_URL = 'http://localhost:5000';

export const signUpWithFirebase = async (email: string, password: string): Promise<User | null> => {
   try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (userCredential) {
         const user = userCredential.user;
         addNewUserToFirestore(user.uid, email);
         return user;
      }
      return null
   } catch (err) {
      // const errCode = err.code;
      // const errMsg = err.message;
      console.log(err);
      return null
   }
   }

export const loginWithFirebase = async (email: string, password: string): Promise<User | null> => {
   try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      if (userCredential) {
         const user = userCredential.user;
         return user;
      }
      return null;
   } catch (error: unknown) {
      // TODO - figure out how to better type cast errors
      console.log('errorrrrrr !!!!')
      // const err = error as unknown
      console.log(error);
      // console.log(error.code);
      // console.log(err.code);
      return null
   }
}

export const signInWithGoogleAuth = async (): Promise<User | null> => {
   try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const user = result.user; // signed-in user info
      return user;
   } catch (error: unknown) {
      // TODO - figure out how to better type cast errors
      console.log('errorrrrrr !!!!')
      console.log(error);
      return null
   }
}
// separate function for sign up flow because we have to add the new user to the firestore on new sign up
export const signUpWithGoogleAuth = async (): Promise<User | null> => {
   try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const user = result.user; // signed-in user info
      addNewUserToFirestore(user.uid, user.email);
      return user;
   } catch (error: unknown) {
      // TODO - figure out how to better type cast errors
      console.log('errorrrrrr !!!!')
      console.log(error);
      return null
   }
}

export const signOutWithFirebase = async (): Promise<void> => {
   try {
      await signOut(firebaseAuth);
      // return true;
   } catch(error: unknown) {
      // TODO - figure out how to better type cast errors
      console.log(error);
      // return null;
   }
}

export const updateUserProfileData = (user: User, userDisplayName: string | null, userPhotoUrl: string | null) => {
   updateProfile(user, { displayName: userDisplayName, photoURL: userPhotoUrl })
   .then(() => {
      // return something to show it worked? 
   })
   .catch(err => {
      console.log(`update didn't work`)
      console.log(err);
      // return something to show that it failed? 
   })
}

// FIRE STORE UPDATES
const userCollectionName = 'users';
const raffleCollectionName = 'raffles';
const txnRaffleCollectionName = 'transactions';

const addNewUserToFirestore = async (userUid: string, emailAddress: string | null) => {
   console.log('adding new user to firestore');
   try {
      await setDoc(doc(firestoreDb, userCollectionName, userUid), {
         uid: userUid,
         emailAddress,
      });
      
   } catch (err) {
      console.log('error adding user to firestore');
      console.log(err);
   }
}

export const updateUserDataOnFirestore = async (uid: string, userDataObject: IUserData) => {
   const { name, phoneNum, city, state, zipCode } = userDataObject;
   try {
      await setDoc(doc(firestoreDb, userCollectionName, uid), {
         name,
         phoneNum,
         city,
         state,
         zipCode,
      }, { merge: true })
   } catch (err) {
      console.log('error updating user in firestore');
      console.log(err);
   }
}

export const updateUserWhenOnboardedToStripe = async (userUid: string, stripeUserData: IStripeUserData ) => {
   try {
      await setDoc(doc(firestoreDb, userCollectionName, userUid), {
         sellerOnboardedToStripe: true,
         stripeAccountData: stripeUserData
      })
   } catch (err) {
      console.log('error updating user\'s stripe data');
      console.log(err)
   }
}

export const addRaffleToFirestore = async (userUid: string, raffleDataObject: IUserDrawData, raffleImages: FileList | null): Promise<boolean> => {
   
   const timeRaffleCreated: Timestamp = Timestamp.now()
   
   const numDaysInSeconds = (raffleDataObject.raffleDuration)*86400;
   const numDaysInMillis = numDaysInSeconds*1000;
   
   const expirationInMillis = timeRaffleCreated.toMillis() + numDaysInMillis;
   const expireDate = Timestamp.fromMillis(expirationInMillis);

   try {
      const newRaffleRef = doc(collection(firestoreDb, raffleCollectionName));
      const data: IDrawDataFromFirestoreType = {
         ...raffleDataObject,
         // add default object values
         id: newRaffleRef.id,
         active: true,
         numRemainingRaffleTickets: raffleDataObject.numTotalRaffleTickets,
         soldRaffleTickets: 0,
         raffleType: 'sneakers',
         timeRaffleCreated,
         raffleExpirationDate: expireDate,
         raffleImageStoragePath: `raffles/${newRaffleRef.id}/images`,
         raffleImageDownloadUrls: [],
      }
      
      await setDoc(newRaffleRef, data);
      if (raffleImages) await uploadRaffleImagesToStorageAndFirestore(userUid, newRaffleRef.id, raffleImages);

      // adding raffle id to user's data object
      const newRaffleId = newRaffleRef.id;
      await updateDoc(doc(firestoreDb, userCollectionName, userUid), {
         raffles: arrayUnion(newRaffleId),
      })

      return true; // returns true if it works

   } catch (err) {
      console.log('error uploading raffle to firestore');
      console.log(err);

      return false; // returns false if it doesn't work
   }
}

export const grabRafflesFromFirestore = async (): Promise<IDrawDataFromFirestoreType[]> => {
   try {
      const querySnapsot = await getDocs(collection(firestoreDb, raffleCollectionName));
      const raffleArr:Array<any> = []; // update to raffleDataFromFirestore type
      querySnapsot.forEach(doc => {
         raffleArr.push(doc.data());
      })
      return raffleArr;
   } catch (err) {
      console.log('error reading raffle data from firestore');
      console.log(err); 
      return []
   }
}

export const grabOneRaffleFromFirestore = async (raffleId: string): Promise<DocumentData | null> => {
   try {
      const docSnapshot = await getDoc(doc(firestoreDb, raffleCollectionName, raffleId))
      if (docSnapshot.exists()) {
         return docSnapshot.data();
      } else {
         return null;
      }
   } catch (err) {
      console.log('err getting raffle from firestore');
      console.log(err);
      return null;
   }
}

export const uploadRaffleImagesToStorageAndFirestore = async (userUid: string, raffleId: string, fileList: FileList) => {
   for (let i=0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (file) {
         uploadOneRaffleImageToStorage(raffleId, file, i);
      }
   }
}

export const uploadOneRaffleImageToStorage = async (raffleId: string, file: File, imageIndex: number) => {
   const raffleFolderName = 'raffles';
   const path = `${raffleFolderName}/${raffleId}/images/${imageIndex}`
   const storageRef = ref(firebaseStorage, path);
   const metadata = {
      contentType: 'image',
   };
   uploadBytes(storageRef, file, metadata)
   .then(async snapshot => {
      const url = await getDownloadURL(ref(firebaseStorage, path));
      const raffleFirestoreRef = doc(firestoreDb, raffleCollectionName, raffleId);
      await updateDoc(raffleFirestoreRef, {
         raffleImageDownloadUrls: arrayUnion(url)
      });
   })
   .catch(err => {
      console.log('error uploading image number', imageIndex);
      console.log(err);
   })
}

export const getRaffleImagesFromStorage = async (raffleId: string): Promise<string[]> => {
   const raffleFolderName = 'raffles';
   const refPath = ref(firebaseStorage, `${raffleFolderName}/${raffleId}/images`)
   let imageUrlArr: string[] = [ ];
   try {
      const listRef = await listAll(refPath); // returns an array of item references

      for (let i=0; i < listRef.items.length; i++) {
         const itemUrl = await getDownloadURL(listRef.items[i]);
         imageUrlArr.push(itemUrl);
      }
      return imageUrlArr;
   } catch (err) {
      console.log('error getting image');
      console.log(err);
      return [ ];
   }
}
const getImageUrlsAtStoragePath = async (storagePath: string): Promise<string[]> => {
   let imageUrlArr: string[] = [ ];
   const refPath = ref(firebaseStorage, storagePath)
   try {
      const listRef = await listAll(refPath); // returns an array of item references
      for (let i=0; i < listRef.items.length; i++) {
         const itemUrl = await getDownloadURL(listRef.items[i]);
         imageUrlArr.push(itemUrl);
      }
      return imageUrlArr;
   } catch (err) {
      console.log('error getting image');
      console.log(err);
      return [ ];
   }  
}

export const getUserDataObjectFromUid = async (userId: string): Promise<DocumentData | null> => {
   try {
      const userDocSnapshot = await getDoc(doc(firestoreDb, userCollectionName, userId));
      if (userDocSnapshot.exists()) {
         return userDocSnapshot.data();
      } else {
         console.log('user doesn\'t exist');
         return null;
      }
   } catch (err) {
      console.log('err getting user data from firebase');
      console.log(err)
      return null;
   }
}

export const addTransactionToFirestore = async (orderData: IUserOrderObject ) => {
   try {
      const newTxnRef = doc(collection(firestoreDb, txnRaffleCollectionName));
      const data: ITransactionFirestoreObject = {
         id: newTxnRef.id,
         dateCompleted: Timestamp.now(),
         ...orderData,
      }
      await setDoc(newTxnRef, data);
   } catch (err) {
      console.log('err adding completed transaction to the firestore')
      console.log(err);
   }
}

export const updateTicketsAvailableInRaffle = async (raffleId: string, ticketsSold: number, ticketsRemaining: number) => {
   try {
      const raffleRef = doc(firestoreDb, raffleCollectionName, raffleId);
      await updateDoc(raffleRef, {
         numRemainingRaffleTickets: ticketsRemaining,
         soldRaffleTickets: ticketsSold,
      })
   } catch (err) {
      console.log('err updating the raffle in the firestore')
      console.log(err);
   }
}