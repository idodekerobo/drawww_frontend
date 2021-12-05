// react
import React, { useState, useContext } from 'react';
// router
import { Redirect, useHistory } from "react-router-dom";
// api's/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { TEST_BACKEND_URL } from '../utils/api';
import { HOME } from '../constants';
// material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// styles
import styles from '../styles/LandingScreen.module.css'
import sneak from '../img/pix_sneak.png'

const LandingScreen = () => {
   const { loggedIn } = useContext(AuthContext);
   const history = useHistory();
   const [userEmail, setEmail] = useState('');

   const onSkipClick = () => {
      history.push(HOME);
   }

   const onSignUpClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log('pressed sign up')
      await fetch(`${TEST_BACKEND_URL}/addEmail`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            emailAddress: userEmail
         }),
      });
      history.push(HOME);
   }

   if (loggedIn) {
      return <Redirect to={HOME} />
   }
   return (
      <div className={styles.container}>
         <div onClick={() => onSkipClick()} className={styles.skipButtonContainer}>
            X
         </div>
         <div className={styles.imgContainer}>
            <img alt="sneaker" className={`${styles.rotate} ${styles.linear} ${styles.infinite}`} src={sneak} />
         </div>

         <form className={styles.signUpForm} onSubmit={onSignUpClick}>
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
            <Button type="submit" className={styles.signUpButton} variant="contained">be the first to know about new raffles</Button>
         </form>
      </div>
   )
}
export default LandingScreen;