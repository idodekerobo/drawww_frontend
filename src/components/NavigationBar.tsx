// react 
import { useContext } from 'react';

// context/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { signOutWithFirebase } from '../utils/api';

// material ui
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';

// react router
import { NavLink } from "react-router-dom";


import { HOME, LOGIN, SIGN_UP, ACCOUNT } from '../constants';

const NavigationBar = () => {
   const { loggedIn, logOutFunction } = useContext(AuthContext);

   const logOut = (): void => {
      logOutFunction()
      signOutWithFirebase();
   }

   return (
      <>
         <CssBaseline />
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
               <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     <NavLink to={HOME}>Home</NavLink>
                  </Typography>

                  {loggedIn ? 
                     <>
                        <Button color="inherit">
                           <NavLink to={ACCOUNT}>My Account</NavLink>
                        </Button>
                        <NavLink to={HOME}>
                           <Button color="inherit" onClick={() => logOut()}>
                              Log Out
                           </Button>
                        </NavLink>
                     </>
                  :
                     <>
                        <Button color="inherit">
                           <NavLink to={SIGN_UP}>Sign Up</NavLink>
                        </Button>
                        <Button color="inherit">
                           <NavLink to={LOGIN}>Login</NavLink>
                        </Button>
                     </>
                  }
               </Toolbar>
            </AppBar>
         </Box>
      </>
   )
}
export default NavigationBar;