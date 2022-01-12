// npm/react
import { useContext, useEffect, useState } from 'react';

// react router
import { Link } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { addUserToSellerWaitlist } from '../utils/api';
import { HOME } from '../constants';

// custom components
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SplashBar from '../components/SplashBar';
import styles from '../styles/SellerOnboardingScreen.module.css';

// material ui
import CircularProgress from '@mui/material/CircularProgress';

const SellerOnboardingScreen = () => {

   const { user } = useContext(AuthContext);
   const [ onSellerWaitlist, setOnSellerWaitlist ] = useState<boolean | null>(null)

   const message = <>{(onSellerWaitlist == null) ? 
      <p className={styles.text}><CircularProgress sx={{margin: 0}} /></p>
   : 
   (onSellerWaitlist) ? 
      <p className={styles.text}>You're already on the wait list!</p>
   :
      <p className={styles.text}>Thanks for signing up!</p>
   }</>
   
   useEffect(() => {
      const wrapperFunc = async () => {
         if (!user) return;
         const result = await addUserToSellerWaitlist(user.uid);
         setOnSellerWaitlist(result);
      }
      wrapperFunc();
   }, [ setOnSellerWaitlist, user ])

   return (
      <div>
         <NavigationBar />
         <SplashBar splashBarText="You'll hear from us soon!" />
         <div className={styles.container}>
            {message}
            <p className={`${styles.text} ${styles.link}`}><Link className={`${styles.link}`} to={HOME}>Back to home.</Link></p>
         </div>
         <div style={{marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </div>
   )
}
export default SellerOnboardingScreen;