import React, { createContext, useState } from 'react';
import { User } from 'firebase/auth';

interface AuthContextInterface {
   loggedIn: boolean,
   user: User | null, 
   logInFunction: (loggedInUser: User) => void,
   logOutFunction: () => void,
   signUpFunction: (loggedInUser: User) => void,
}

const initialState = {
   loggedIn: false,
   user: null,
   logInFunction: () => console.log('login'),
   logOutFunction: () => console.log('logout'),
   signUpFunction: () => console.log('signup'),
}

// create context
const AuthContext = createContext<AuthContextInterface>(initialState);

// provider component
const AuthContextProvider = ( {children }: { children: React.ReactNode}) => {

   const [ loggedIn, setLoggedIn ] = useState<boolean>(false);
   const [ user, setUser ] = useState<User | null>(null);

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

   return (
      <AuthContext.Provider value={{
         loggedIn: loggedIn,
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
export type { AuthContextInterface };
