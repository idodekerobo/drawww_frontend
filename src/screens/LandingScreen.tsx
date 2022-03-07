// react
import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Redirect, useHistory } from "react-router-dom";

// api's/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { BACKEND_URL } from '../utils/api';
import { HOME } from '../constants';
// material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

// styles
import styles from '../styles/LandingScreen.module.css'
import sneak from '../img/pix_sneak.png'

const LandingScreen = () => {
   const { loggedIn } = useContext(AuthContext);

   if (loggedIn) {
      return <Redirect to={HOME} />
   }
   return <EmailSignUpPage />
}
export default LandingScreen;

export const EmailSignUpPage = () => {
   const history = useHistory();
   const [ userEmail, setEmail ] = useState('');
   const [ signedUp, setSignedUp ] = useState(false);

   const onSkipClick = () => {
      history.push(HOME);
   }

   const onSignUpClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignedUp(true);
      setTimeout(() => onSkipClick(), 2800)
      await fetch(`${BACKEND_URL}/addEmail`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            emailAddress: userEmail
         }),
      });
   }

   useEffect(() => {
      localStorage.setItem('firstVisit', 'false')
   }, [ ])

   return (
      <div className={styles.container}>
         <Helmet>
            <title> drawww | buying and selling sneaker raffles</title>
            <meta name="description" content="Raffle and draw tickets for Jordan's, Dunks, New Balances, Yeezy's and more" />
            <link rel="canonical" href={window.location.href} />
         </Helmet>
         <div onClick={() => onSkipClick()} className={styles.skipButtonContainer}>
            X
         </div>

         { signedUp ? 
            <div>
               <p><span className={`${styles.emoji} ${styles.leftEmoji}`}>🤝</span>you'll hear from us soon<span className={styles.emoji}>🤝</span></p>
            </div>    
         :
            <>
               <div className={styles.imgContainer}>
                  <img alt="sneaker" className={`${styles.rotate} ${styles.linear} ${styles.infinite}`} src={sneak} />
               </div>

               <form className={styles.signUpForm} onSubmit={onSignUpClick}>
                  <p className={`${styles.infoText}`}>win draws, pay less</p>
                  <p className={`${styles.infoText}`}>host your own draws</p>
                  <div className={styles.iconContainer}>
                     <a href="https://www.instagram.com/drawww.xyz/">
                        <InstagramIcon className={styles.icon} />
                     </a>
                     <a href="https://twitter.com/drawwwxyz">
                        <TwitterIcon className={styles.icon} />
                     </a>
                  </div>
                  <TextField
                     sx={{ marginBottom: 1 }}
                     className={styles.emailInput}
                     required
                     type="email"
                     id="outlined-required"
                     label="email address"
                     placeholder="email address"
                     value={userEmail}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" className={styles.signUpButton} variant="contained">be the first to know about a new draw</Button>
               </form>
            </>
         }
      </div>
   )
}