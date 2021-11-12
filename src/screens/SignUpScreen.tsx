// react
import { useContext, useState } from 'react';

// npm
import { Redirect } from "react-router-dom";

// custom components
import NavigationBar from '../components/NavigationBar';

// api/utils
import { WELCOME } from '../constants';
import { signUpWithFirebase, signUpWithGoogleAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext/AuthContext';

// material ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SignUpScreen = () => {
   const { loggedIn, signUpFunction } = useContext(AuthContext);
   const [ email, setEmail ] = useState<string>('')
   const [ password, setPassword ] = useState<string>('');

   const onSignUpClick = async () => {
      const user = await signUpWithFirebase(email, password)
      if (user) {
         setEmail('');
         setPassword('');
         signUpFunction(user);
      }
   }

   const onSignUpWithGoogleClick = async () => {
      const user = await signUpWithGoogleAuth();
      if (user) {
         setEmail('');
         setPassword('');
         signUpFunction(user);
      }
   }

   if (loggedIn) {
      return (
         <Redirect to={WELCOME} />
      )
   }

   return (
      <>
         <NavigationBar />

         <Container maxWidth="lg">
            <Button onClick={() => onSignUpWithGoogleClick()} variant="contained">
               Sign Up With Google
            </Button>
            <Box component="form" sx={{ bgcolor: '#cfe8fc', height: '75vh' }}>
               <TextField
                  required
                  type="email"
                  id="outlined-required"
                  label="Email"
                  value={email}
                  placeholder="Email"
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

               <Button onClick={() => onSignUpClick()} variant="contained">Sign Up</Button>
            </Box>
         </Container>
      </>
   )
}
export default SignUpScreen;