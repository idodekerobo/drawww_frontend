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
import LandingScreen, { EmailSignUpPage } from './screens/LandingScreen';
import PrivateRouteWrapper from './screens/PrivateRouteWrapper';
import LoadingScreen from './screens/LoadingScreen';
import SellerOnboarding from './screens/SellerOnboardingScreen';
import FaqScreen from './screens/FaqScreen';
import ErrorScreen from './screens/ErrorScreen';
import BlogScreen from './screens/BlogScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import EmailListWrapperComponent from './components/EmailListDialog';
import AboutScreen from './screens/AboutScreen';
import PrivacyPolicy from './screens/PrivacyPolicy';
import ReturnPolicy from './screens/ReturnPolicy';

// react router
import { Switch, Route, useLocation, Redirect } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HOME, LOGIN, SIGN_UP, WELCOME, ACCOUNT, ADD_DRAW, DRAW, LANDING, START_SELLING, FAQ, EMAIL_LIST_PAGE, BLOG, THANK_YOU } from './constants'

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
               <EmailListWrapperComponent />
               <DrawDetailsScreen />
            </Route>

            <Route path={THANK_YOU}>
               <ThankYouScreen />
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
               <EmailListWrapperComponent />
               <FaqScreen />
            </Route>

            <Route path={HOME}>
               <EmailListWrapperComponent />
               <HomeScreen />
            </Route>

            <Route exact path={LANDING}>
               <LandingScreen />
            </Route>

            <Route path={EMAIL_LIST_PAGE}>
               <EmailSignUpPage />
            </Route>

            <Route path={BLOG}>
               <EmailListWrapperComponent />
               <BlogScreen />
            </Route>

            <Route path={'/about/returns'}>
               <ReturnPolicy />
            </Route>
            
            <Route path={'/about/privacy'}>
               <PrivacyPolicy />
            </Route>
            <Route path={'/about'}>
               <AboutScreen />
            </Route>
            
            <Route path={'/404'}>
               <EmailListWrapperComponent />
               <ErrorScreen />
            </Route>

            <Redirect to="/404" />
         </Switch>
      </ThemeProvider>
   );
}

export default App;