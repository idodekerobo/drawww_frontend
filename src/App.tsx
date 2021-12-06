import { useContext } from 'react';
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
import PrivateRouteWrapper from './screens/PrivateRouteWrapper';
import LoadingScreen from './screens/LoadingScreen';

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
   const { loading } = useContext(AuthContext)

   if (loading) {
      return <LoadingScreen /> 
   }
   return (
      <ThemeProvider theme={theme}>
         <Switch>

            <PrivateRouteWrapper path={`${ACCOUNT}/:accountId`}>
               <AccountScreen />
            </PrivateRouteWrapper>

            <Route path={`${RAFFLE}/:raffleId`}>
               <Elements stripe={stripePromise}>
                  <RaffleDetailsScreen />
               </Elements>
            </Route>

            <Route path={LOGIN}>
               <LoginScreen />
            </Route>

            <Route path={SIGN_UP}>
               <SignUpScreen />
            </Route>

            <PrivateRouteWrapper path={WELCOME}>
               <WelcomeScreen />
            </PrivateRouteWrapper>

            <PrivateRouteWrapper path={ADD_RAFFLE}>
               <AddRaffleScreen />
            </PrivateRouteWrapper>


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