import React, { createContext, useEffect, useState } from 'react';
import { firebaseAuth } from '../../utils/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { IAuthContextInterface } from '../../utils/types';
import { LocalDining } from '@mui/icons-material';

const initialState = {
   loggedIn: false,
   loading: true,
   user: null,
   logInFunction: () => console.log('login'),
   logOutFunction: () => console.log('logout'),
   signUpFunction: () => console.log('signup'),
}

// create context
const AuthContext = createContext<IAuthContextInterface>(initialState);

// provider component
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

   const [loggedIn, setLoggedIn] = useState<boolean>(false);
   const [ loading, setLoading ] = useState<boolean>(true);
   const [user, setUser] = useState<User | null>(null);

   const logInFunction = (loggedInUser: User) => {
      setLoggedIn(true);
      setUser(loggedInUser);
   }
   const logOutFunction = () => {
      setLoggedIn(false);
      setUser(null);
   }
   const signUpFunction = (signedUpUser: User) => {
      setLoggedIn(true);
      setUser(signedUpUser);
   }

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
         if (user) {
            setLoading(false);
            setLoggedIn(true);
            setUser(user);
         } else {
            setLoading(false);
            setUser(null);
         }
      });
      return unsubscribe;
   }, [])

   return (
      <AuthContext.Provider value={{
         loggedIn: loggedIn,
         loading: loading,
         user: user,
         logInFunction: logInFunction,
         logOutFunction: logOutFunction,
         signUpFunction: signUpFunction
      }}>
         {children}
      </AuthContext.Provider>
   )
}

export { AuthContext, AuthContextProvider };
