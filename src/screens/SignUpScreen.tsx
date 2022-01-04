// react
import React, { useContext, useState } from 'react';

// npm
import { useHistory, Redirect, Link } from "react-router-dom";

// custom components
import NavigationBar from '../components/NavigationBar';

// api/utils
import { WELCOME, HOME, LOGIN } from '../constants';
import { signUpWithFirebase, signUpWithGoogleAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { useWindowDimensions } from '../utils/hooks';

// styles
import styles from '../styles/LoginScreen.module.css'

// material ui
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SignUpScreen = () => {
   const history = useHistory();
   const { loggedIn, signUpFunction } = useContext(AuthContext);
   const { windowWidth } = useWindowDimensions();
   const [ email, setEmail ] = useState<string>('')
   const [ password, setPassword ] = useState<string>('');

   const onSignUpClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const user = await signUpWithFirebase(email, password)
      if (user) {
         setEmail('');
         setPassword('');
         signUpFunction(user);
      }
      history.push(WELCOME);
   }

   const onSignUpWithGoogleClick = async () => {
      const user = await signUpWithGoogleAuth();
      if (user) {
         setEmail('');
         setPassword('');
         signUpFunction(user);
      }
      history.push(WELCOME);
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
            <p>Please create an account!</p>
            <p>
               Already have an account? <Link className={styles.link} to={LOGIN}>Log in.</Link>
            </p>
            <form className={styles.loginForm} onSubmit={onSignUpClick}>
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="email"
                  label="Email"
                  value={email}
                  placeholder="Email"
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

               <Button className={styles.loginButton} sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} type="submit" variant="contained">Sign Up</Button>
            </form>

            <Button className={styles.loginButton} sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} onClick={() => onSignUpWithGoogleClick()} variant="contained">
               Sign Up With Google
            </Button>
         </Container>
      </>
   )
}
export default SignUpScreen;