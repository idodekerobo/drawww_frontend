// react
import React, { useContext, useState } from 'react';

// react router
import { useHistory, Redirect, Link } from "react-router-dom";

// utilities
import { loginWithFirebase, signInWithGoogleAuth, checkIfUserExistsInFirestore, addNewUserToFirestore } from '../utils/api';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { HOME, SIGN_UP, WELCOME } from '../constants';
import { useWindowDimensions } from '../utils/hooks';

// custom components
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

// styles
import styles from '../styles/LoginScreen.module.css'

// material ui
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const LoginScreen = () => {
   const history = useHistory();
   const { windowWidth } = useWindowDimensions();
   const { loggedIn, logInFunction } = useContext(AuthContext);
   
   const [ email, setEmail ] = useState<string>('')
   const [ password, setPassword ] = useState<string>('');
   const [ loginButtonsDisabled, setLoginButtonsDisabled ] = useState(false);

   const onLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoginButtonsDisabled(true);
      const user = await loginWithFirebase(email, password);
      if (user) {
         setEmail('');
         setPassword('');
         setLoginButtonsDisabled(false);
         logInFunction(user);
      } else {
         setLoginButtonsDisabled(false);
      }
   }
   
   const onSignInWithGoogleClick = async () => {
      setLoginButtonsDisabled(true);
      const user = await signInWithGoogleAuth();
      if (user) {
         const userExistsInDb = await checkIfUserExistsInFirestore(user.uid);
         if (!userExistsInDb) {
            addNewUserToFirestore(user.uid, user.email);
            setEmail('');
            setPassword('');
            setLoginButtonsDisabled(false);
            logInFunction(user);
            history.push(WELCOME);
         } else {
            setEmail('');
            setPassword('');
            setLoginButtonsDisabled(false);
            logInFunction(user);
         }
      } else {
         setLoginButtonsDisabled(false);
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
               Please sign in!
            </p>
            <p>
               No account? <Link className={styles.link} to={SIGN_UP}>Sign up.</Link>
            </p>
            <form className={styles.loginForm} onSubmit={onLoginClick}>
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="email"
                  label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="password"
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />

               <Button disabled={loginButtonsDisabled} className={styles.loginButton} sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} type="submit" variant="contained">Log In</Button>
            </form>
            
            <Button disabled={loginButtonsDisabled} className={styles.loginButton} sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} onClick={() => onSignInWithGoogleClick()} color='primary' variant="contained" >
               Sign In With Google
            </Button>

         </Container>
         <div style={{marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </>
   )
}
export default LoginScreen;