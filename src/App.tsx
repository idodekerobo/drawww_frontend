import { useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext/AuthContext';
// screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AccountScreen from './screens/AccountScreen';
import AddRaffleScreen from './screens/AddRaffleScreen';
import RaffleDetailsScreen from './screens/RaffleDetailsScreen'
import LandingScreen from './screens/LandingScreen';

// react router
import { Switch, Route } from "react-router-dom";

// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HOME, LOGIN, SIGN_UP, WELCOME, ACCOUNT, ADD_RAFFLE, RAFFLE, LANDING } from './constants'

const stripePromise = loadStripe('pk_test_51H0IWVL4UppL0br2bYSp1tlwvfoPwDEjfjPUx4ilY0zQr8LY0txFJjj9CHqPTP27ieDiTHhxQfNlaKSuPVcNkuq00071qG37ks');

const theme = createTheme({
   palette: {
      primary: {
         main: '#000000',
         light: '#fefefe',
      }
   }
})

function App() {
   const { loggedIn, user, loading } = useContext(AuthContext)
   
   useEffect(() => {
      console.log('logged in: ', loggedIn);
      console.log('user: ', user);
   }, [ ]);
   if (loading) {
      return (
         <div>
            Loading...
         </div>
      )
   }
   return (
      <ThemeProvider theme={theme}>
         <Switch>

            <Route path={LOGIN}>
               <LoginScreen />
            </Route>

            <Route path={SIGN_UP}>
               <SignUpScreen />
            </Route>

            <Route path={WELCOME}>
               <WelcomeScreen />
            </Route>

            <Route path={`${ACCOUNT}/:accountId`}>
               <AccountScreen />
            </Route>

            <Route path={ADD_RAFFLE}>
               <AddRaffleScreen />
            </Route>

            <Route path={`${RAFFLE}/:raffleId`}>
               <Elements stripe={stripePromise}>
                  <RaffleDetailsScreen />
               </Elements>
            </Route>

            <Route path={HOME}>
               <HomeScreen />
            </Route>

            <Route exact path={LANDING}>
               <LandingScreen />
            </Route>

         </Switch>
      </ThemeProvider>
   );
}

export default App;
