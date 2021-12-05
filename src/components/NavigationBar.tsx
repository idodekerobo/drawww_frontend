// react 
import { useContext } from 'react';

// context/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { signOutWithFirebase } from '../utils/api';

// styles
import styles from '../styles/NavigationBar.module.css'

// material ui
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';

// react router
import { NavLink } from "react-router-dom";


import { HOME, LOGIN, ACCOUNT, ADD_RAFFLE } from '../constants';

const NavigationBar = () => {
   const { user, loggedIn, logOutFunction } = useContext(AuthContext);

   const logOut = (): void => {
      logOutFunction()
      signOutWithFirebase();
   }

   return (
      <>
         <CssBaseline />
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
               <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     <NavLink className={styles.navLink} to={HOME}>Home</NavLink>
                  </Typography>

                  <Button color="inherit">
                     <NavLink className={styles.navLink} to={ADD_RAFFLE}>Add Raffle</NavLink>
                  </Button>
                  
                  {loggedIn ? 
                     <>
                        <Button color="inherit">
                           {user ? <NavLink className={styles.navLink} to={`${ACCOUNT}/${user.uid}`}>My Account</NavLink> : null}
                        </Button>
                        <NavLink className={styles.navLink} to={HOME}>
                           <Button color="inherit" onClick={() => logOut()}>
                              Log Out
                           </Button>
                        </NavLink>
                     </>
                  :
                     <Button color="inherit">
                        <NavLink className={styles.navLink} to={LOGIN}>Login</NavLink>
                     </Button>
                  }
               </Toolbar>
            </AppBar>
         </Box>
      </>
   )
}
export default NavigationBar;