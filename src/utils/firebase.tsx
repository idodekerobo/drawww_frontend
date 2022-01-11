// import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
   apiKey: "AIzaSyCO4NfmV0BOXn-YkO1NOU1_y0pqliVEKw4",
   authDomain: "raffles-44479.firebaseapp.com",
   projectId: "raffles-44479",
   storageBucket: "raffles-44479.appspot.com",
   messagingSenderId: "628790025919",
   appId: "1:628790025919:web:456d8ade10f11d9459f00a",
   measurementId: "G-E1TWV3Z9R2"
};
// const testAppConfig = {
//    apiKey: "AIzaSyD7QoZFWFbHPiBO0jJeIAf7hffn-TI3NEM",
//    authDomain: "test-dra-app.firebaseapp.com",
//    projectId: "test-dra-app",
//    storageBucket: "test-dra-app.appspot.com",
//    messagingSenderId: "1075987133948",
//    appId: "1:1075987133948:web:b03b955f8380cb5ed9ee79",
//    measurementId: "G-QL2HP57H94"
// };

const firebaseApp = initializeApp(firebaseConfig);
// const firebaseApp = initializeApp(testAppConfig);
// const firebaseAnalytics = getAnalytics(firebaseApp);
export default firebaseApp;
export const firebaseAuth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export const firestoreDb = getFirestore();
export const firebaseStorage = getStorage(firebaseApp);