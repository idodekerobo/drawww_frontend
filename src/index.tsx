import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from './context/AuthContext/AuthContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import reportWebVitals from './reportWebVitals';

const paypalOptions = {
   'client-id': (process.env.REACT_APP_PAYPAL_LIVE_CLIENT_ID ? process.env.REACT_APP_PAYPAL_LIVE_CLIENT_ID : 'placeholder'), // live drawww merchant app
   // 'client-id': (process.env.REACT_APP_PAYPAL_TEST_CLIENT_ID ? process.env.REACT_APP_PAYPAL_TEST_CLIENT_ID : 'placeholder'), // test drawww merchant app
   currency: 'USD',
   intent: 'capture',
   // 'data-clint-token': 'abc123xyz==',
}

ReactDOM.render(
  <React.StrictMode>
     <AuthContextProvider>
        <PayPalScriptProvider options={paypalOptions}>
            <Router>
                  <App/>
            </Router>
         </PayPalScriptProvider>
      </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
