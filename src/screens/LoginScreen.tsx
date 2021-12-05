// react
import React, { useContext, useState } from 'react';

// react router
import { Redirect, Link } from "react-router-dom";

// utilities
import { loginWithFirebase, signInWithGoogleAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { HOME, SIGN_UP } from '../constants';
import { useWindowDimensions } from '../utils/hooks';

// custom components
import NavigationBar from '../components/NavigationBar';

// styles
import styles from '../styles/LoginScreen.module.css'

// material ui
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const LoginScreen = () => {
   // TODO - add user experience to sign up if no account

   const { windowWidth } = useWindowDimensions();
   const { loggedIn, logInFunction } = useContext(AuthContext);

   const [ email, setEmail ] = useState<string>('')
   const [ password, setPassword ] = useState<string>('');

   const onLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const user = await loginWithFirebase(email, password);
      if (user) {
         setEmail('');
         setPassword('');
         logInFunction(user);
      }
   }
   
   const onSignInWithGoogleClick = async () => {
      const user = await signInWithGoogleAuth();
      if (user) {
         setEmail('');
         setPassword('');
         logInFunction(user);
      }
   }

   if (loggedIn) {
      return (
         <Redirect to={HOME} />
      )
   }
   return (
      <>
         <NavigationBar />
         
         <Container sx={{ width: ((windowWidth > 399) ? '60%' : '100%') }} className={styles.containerWrapper} maxWidth="xl">
            <p>
               No account? <Link className={styles.link} to={SIGN_UP}>Sign up.</Link>
            </p>
            <form className={styles.loginForm} onSubmit={onLoginClick}>
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="email"
                  id="outlined-required"
                  label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="password"
                  id="outlined-required"
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />

               <Button className={styles.loginButton} sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} type="submit" variant="contained">Log In</Button>
            </form>
            
            <Button className={styles.loginButton} sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} onClick={() => onSignInWithGoogleClick()} color='primary' variant="contained" >
               Sign In With Google
            </Button>

         </Container>
      </>
   )
}
export default LoginScreen;