import { firebaseAuth, googleAuthProvider, firestoreDb, firebaseStorage } from './firebase';
import { IUserData, IUserDrawData, IDrawDataFromFirestoreType, IDrawTicket } from './types'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
   signInWithPopup, updateProfile, User,
} from 'firebase/auth';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, arrayUnion, Timestamp, DocumentData } from "firebase/firestore";
import { AuthError } from 'firebase/auth';
// import { FirebaseError } from 'firebase/app';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';

// MAKE SURE YOU DON'T PUT A / AFTER THE API URL
// export const BACKEND_URL = 'http://localhost:5000';
export const BACKEND_URL = 'https://drawww-backend.herokuapp.com';
// export const STRIPE_PUBLISHABLE_TEST_KEY = 'pk_test_51H0IWVL4UppL0br2bYSp1tlwvfoPwDEjfjPUx4ilY0zQr8LY0txFJjj9CHqPTP27ieDiTHhxQfNlaKSuPVcNkuq00071qG37ks';
// export const STRIPE_PUBLISHABLE_LIVE_KEY = 'pk_live_51H0IWVL4UppL0br24eHsSMTrCwqn14x1ZO9Sss27X1lHVrX7dsIHRIOSKAqU9yoi4YwmDYsPq5wMOknK3L3XdV6E00EVOPuHvc';

export const signUpWithFirebase = async (email: string, password: string): Promise<User | null> => {
   try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (userCredential) {
         const user = userCredential.user;
         addNewUserToFirestore(user.uid, email);
         return user;
      }
      return null
   } catch (error: unknown) {
      const e = error as AuthError;
      console.log(e);
      console.log(e.code)
      console.log(e.message)
      alert(e.code);
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
      const e = error as AuthError;
      console.log(e);
      console.log(e.code)
      console.log(e.message)
      alert(e.code);
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
      const e = error as AuthError;
      console.log(e);
      console.log(e.code)
      console.log(e.message)
      alert(e.code);
      return null
   }
}
export const checkIfUserExistsInFirestore = async (userUid: string): Promise<boolean> => {
   const userDocRef = doc(firestoreDb, userCollectionName, userUid);
   try {
      const userDataSnapshot = await getDoc(userDocRef);
      if (userDataSnapshot.exists()) {
         return true;
      } 
      return false;
   } catch (err) {
      console.log('error checking for user on firestore');
      console.log(err);
      return false;
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
      const e = error as AuthError;
      console.log(e);
      console.log(e.code)
      console.log(e.message)
      alert(e.code);
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
export const raffleCollectionName = 'draws';
const txnRaffleCollectionName = 'transactions';
const sellerWaitlistCollectionName = 'sellerWaitlist';

export const addNewUserToFirestore = async (userUid: string, emailAddress: string | null) => {
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
   const { name, phoneNum, city, state, zipCode, shoeGender, shoeSize } = userDataObject;
   try {
      await setDoc(doc(firestoreDb, userCollectionName, uid), {
         name,
         phoneNum,
         city,
         state,
         zipCode,
         shoeGender,
         shoeSize
      }, { merge: true })
   } catch (err) {
      console.log('error updating user in firestore');
      console.log(err);
   }
}

const createTicketsToAddDraw = (raffleId: string, numTickets: number): IDrawTicket[] => {
   // get raffle doc reference
   let arrayOfTickets: IDrawTicket[] = [ ];

   for (let i=1; i <= numTickets; i++) {
      const ticket = {
         id: `${i}`,
         number: i,
         status: 0,
         raffleId,
      }
      arrayOfTickets.push(ticket);
   }
   return arrayOfTickets;
}
export const addRaffleToFirestore = async (userUid: string, raffleDataObject: IUserDrawData, raffleImages: FileList | null): Promise<boolean> => {
   
   const timeRaffleCreated: Timestamp = Timestamp.now()
   
   const numDaysInSeconds = (raffleDataObject.raffleDuration)*86400;
   const numDaysInMillis = numDaysInSeconds*1000;
   
   const expirationInMillis = timeRaffleCreated.toMillis() + numDaysInMillis;
   const expireDate = Timestamp.fromMillis(expirationInMillis);

   try {
      const newRaffleRef = doc(collection(firestoreDb, raffleCollectionName));
      const tickets = createTicketsToAddDraw(newRaffleRef.id, raffleDataObject.numTotalRaffleTickets)
      const data: IDrawDataFromFirestoreType = {
         ...raffleDataObject,
         // add default object values
         id: newRaffleRef.id,
         active: true,
         numRemainingRaffleTickets: raffleDataObject.numTotalRaffleTickets,
         soldRaffleTickets: 0,
         tickets,
         raffleType: 'sneakers',
         timeRaffleCreated,
         raffleExpirationDate: expireDate,
         transactions: [],
         buyerTickets: [],
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

export const addUserToSellerWaitlist = async (userUid: string): Promise<boolean> => {
   try {
      const docSnapshot = await getDoc(doc(firestoreDb, userCollectionName, userUid))
      
      if (docSnapshot.exists()) {
         
         const userData = docSnapshot.data() as IUserData;
         if (userData.sellerWaitlist) return true;

         try {
            await updateDoc(doc(firestoreDb, userCollectionName, userUid), {
               sellerWaitlist: true
            })
            await setDoc(doc(firestoreDb, sellerWaitlistCollectionName, userUid), {
               name: userData.name,
               uid: userUid,
               email: userData.emailAddress
            });
            return false;
         } catch (err) {
            console.log('err addig user to waitlist on firestore');
            console.log(err);
            return false;
         }
      }
   } catch (err) {
      console.log('err getting user from firestore');
      console.log(err);
      return false;
   }
   return false;
}