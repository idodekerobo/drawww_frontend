import { useContext } from 'react';
import { AuthContext } from './context/AuthContext/AuthContext';
// screens
import AudioPlayer from './components/AudioPlayer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AccountScreen from './screens/AccountScreen';
import AddDrawScreen from './screens/AddDrawScreen';
import DrawDetailsScreen from './screens/DrawDetailsScreen'
import LandingScreen from './screens/LandingScreen';
import PrivateRouteWrapper from './screens/PrivateRouteWrapper';
import LoadingScreen from './screens/LoadingScreen';
import SellerOnboarding from './screens/SellerOnboardingScreen';
import FaqScreen from './screens/FaqScreen';
import ErrorScreen from './screens/ErrorScreen';

// react router
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HOME, LOGIN, SIGN_UP, WELCOME, ACCOUNT, ADD_DRAW, DRAW, LANDING, START_SELLING, FAQ } from './constants'
import { STRIPE_PUBLISHABLE_TEST_KEY, STRIPE_PUBLISHABLE_LIVE_KEY } from './utils/api';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_TEST_KEY);
// const stripePromise = loadStripe(STRIPE_PUBLISHABLE_LIVE_KEY);

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
   const location = useLocation();

   if (loading) {
      return <LoadingScreen /> 
   }
   return (
      <ThemeProvider theme={theme}>
         <AudioPlayer path={location.pathname} />
         <Switch>
            <PrivateRouteWrapper path={`${ACCOUNT}/:accountId`}>
               <AccountScreen />
            </PrivateRouteWrapper>

            <Route path={`${DRAW}/:drawId`}>
               <Elements stripe={stripePromise}>
                  <DrawDetailsScreen />
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

            <PrivateRouteWrapper path={ADD_DRAW}>
               <AddDrawScreen />
            </PrivateRouteWrapper>

            <PrivateRouteWrapper path={START_SELLING}>
               <SellerOnboarding />
            </PrivateRouteWrapper>

            <Route path={FAQ}>
               <FaqScreen />
            </Route>

            <Route path={HOME}>
               <HomeScreen />
            </Route>

            <Route exact path={LANDING}>
               <LandingScreen />
            </Route>

            <Route path={'/404'}>
               <ErrorScreen />
            </Route>

            <Redirect to="/404" />
         </Switch>
      </ThemeProvider>
   );
}

export default App;