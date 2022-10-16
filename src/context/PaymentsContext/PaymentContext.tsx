import React, { createContext, useState, useEffect } from 'react';

const testUrl = 'http://localhost:5000/braintree_client_token';
// const liveUrl = '';
const initialState = {
   token: '',
}

const PaymentContext = createContext(initialState);
const PaymentContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [ token, setToken ] = useState('')

   const getToken = async () => {
      const tokenResponse = await fetch(testUrl, {
         method: "GET",
         headers: {
            'Content-type': 'application/json'
         },
      });
      const tokenObject = await tokenResponse.json();
      // console.log(tokenObject.token);
      setToken(tokenObject.token);
   }

   useEffect(() => {
      getToken();
   }, [ ])

   return (
      <PaymentContext.Provider value={{
         token: token
      }}>
         {children}
      </PaymentContext.Provider>
   )
}
export { PaymentContext, PaymentContextProvider };