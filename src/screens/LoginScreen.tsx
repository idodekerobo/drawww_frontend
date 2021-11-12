// react
import { useContext, useState } from 'react';

// react router
import { Redirect } from "react-router-dom";

// utilities
import { loginWithFirebase, signInWithGoogleAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { HOME } from '../constants';

// custom components
import NavigationBar from '../components/NavigationBar';

// material ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const LoginScreen = () => {
   // TODO - add user experience to sign up if no account

   const { loggedIn, logInFunction } = useContext(AuthContext);

   const [ email, setEmail ] = useState<string>('')
   const [ password, setPassword ] = useState<string>('');

   const onLoginClick = async () => {
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
         
         <Container maxWidth="lg">
            <Button onClick={() => onSignInWithGoogleClick()} variant="contained">
               Sign In With Google
            </Button>
            <Box component="form" sx={{ bgcolor: '#cfe8fc', height: '75vh' }}>
               <TextField
                  required
                  type="email"
                  id="outlined-required"
                  label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
               <TextField
                  required
                  type="password"
                  id="outlined-required"
                  label="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />

               <Button onClick={() => onLoginClick()} variant="contained">Login</Button>

            </Box>
         </Container>
      </>
   )
}
export default LoginScreen;