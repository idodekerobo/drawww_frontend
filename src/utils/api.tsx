import { firebaseAuth, googleAuthProvider, firestoreDb } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
   signInWithPopup, updateProfile, User,
} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

export const signUpWithFirebase = async (email: string, password: string): Promise<User | null> => {
   try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (userCredential) {
         const user = userCredential.user;
         addNewUserToFirestore(user.uid);
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
      addNewUserToFirestore(user.uid);
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

const addNewUserToFirestore = async (userUid: string) => {
   console.log('adding new user to firestore');
   try {
      await setDoc(doc(firestoreDb, userCollectionName, userUid), {
         uid: userUid,
      });
      
   } catch (err) {
      console.log('error adding user to firestore');
      console.log(err);
   }
}

interface userData {
   name: string,
   phoneNum: string,
   city: string,
   state: string,
   zipCode: string
}
export const updateUserDataOnFirestore = async (uid: string, userDataObject: userData) => {
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