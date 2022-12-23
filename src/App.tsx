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
import AuthRequiredRoute from './screens/PrivateRouteWrapper';
import LoadingScreen from './screens/LoadingScreen';
import SellerOnboarding from './screens/SellerOnboardingScreen';
import FaqScreen from './screens/FaqScreen';
import ErrorScreen from './screens/ErrorScreen';
import BlogScreen from './screens/BlogScreen';
import ThankYouScreen from './screens/ThankYouScreen';
import EmailListWrapperComponent from './components/EmailListDialog';
import AboutScreen from './screens/AboutScreen';
import { ReturnPolicy, PrivacyPolicy, ChargebackPolicy, CustomerService, ShippingHandling } from './screens/Policies';
import HelpScreen from './screens/Help';

// react router
import { Route, Routes, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HOME, LOGIN, SIGN_UP, WELCOME, ACCOUNT, ADD_DRAW, DRAW, LANDING, START_SELLING, FAQ, EMAIL_LIST_PAGE, BLOG, THANK_YOU, HELP } from './constants'

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
         <Routes>
            <Route path={`${ACCOUNT}/:accountId`}
               element={
                  <AuthRequiredRoute redirectTo={LOGIN}>
                     <AccountScreen />
                  </AuthRequiredRoute>
               }
             /> 

            <Route path={`${DRAW}/:drawId`}
               element={
                  <DrawDetailsScreen />
               }
            />

            <Route path={THANK_YOU} element={ <ThankYouScreen />} />

            <Route path={LOGIN} element={<LoginScreen />} />

            <Route path={SIGN_UP} element={ <SignUpScreen />} />

            <Route path={WELCOME}
               element={
                  <AuthRequiredRoute redirectTo={LOGIN}>
                     <WelcomeScreen />
                  </AuthRequiredRoute>
               }
            />

            <Route path={ADD_DRAW}
               element={
                  <AuthRequiredRoute redirectTo={LOGIN}>
                     <AddDrawScreen />
                  </AuthRequiredRoute>
               }
            />
            <Route path={START_SELLING}
               element={
                  <AuthRequiredRoute redirectTo={LOGIN}>
                     <SellerOnboarding />
                  </AuthRequiredRoute>
               }
            />

            <Route path={HELP} element={<HelpScreen />}>
               <Route path='chargebacks' element={ <ChargebackPolicy /> } />
               <Route path='returns' element={<ReturnPolicy />} />
               <Route path='privacy' element={<PrivacyPolicy />} />
               <Route path='customerservice' element={<CustomerService />} />
               <Route path='shippinghandling' element={ <ShippingHandling />} /> 
            </Route>

            <Route path={FAQ} element={<FaqScreen />} />

            <Route path={HOME} element={ <HomeScreen /> } />

            <Route path={LANDING} element={<LandingScreen />} />

            <Route path={EMAIL_LIST_PAGE} element={<EmailSignUpPage />} />

            <Route path={BLOG} element={ <BlogScreen /> } />
             
            <Route path={'/about'} element={ <AboutScreen /> } /> 
            
            <Route path='*' element={ <ErrorScreen /> } /> 
         </Routes>
      </ThemeProvider>
   );
}

export default App;