// react 
import { useContext } from 'react';
// context/utils
import { AuthContext } from '../context/AuthContext/AuthContext';

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

import logo from '../img/drawww.png';
import { HOME, LOGIN, ACCOUNT, FAQ, BLOG, HELP } from '../constants';
// import { START_SELLING, ADD_DRAW } from '../constants';

const NavigationBar = () => {
   const { user, loggedIn } = useContext(AuthContext);

   return (
      <>
         <CssBaseline />
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
               <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     <NavLink className={styles.navLink} to={HOME}>
                        <img className={styles.navLogo} src={logo} alt="logo"/>
                     </NavLink>
                  </Typography>

                  {/* <Button color="inherit">
                     <NavLink className={styles.navLink} to={ADD_DRAW}>Add Draw</NavLink>
                  </Button> */}
                  
                  <Button color="inherit">
                     <NavLink className={styles.navLink} to={BLOG}>Blog</NavLink>
                  </Button>

                  <Button color="inherit">
                     <NavLink className={styles.navLink} to={FAQ}>TF Is Drawww??</NavLink>
                  </Button>

                  <Button color="inherit">
                     <NavLink className={styles.navLink} to={HELP}>Help</NavLink>
                  </Button>
                  
                  {loggedIn ? 
                     <>
                        <Button color="inherit">
                           {user ? <NavLink className={styles.navLink} to={`${ACCOUNT}/${user.uid}`}>Account</NavLink> : null}
                        </Button>
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