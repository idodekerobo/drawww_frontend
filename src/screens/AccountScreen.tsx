// react/npm
import { useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

// api/utils
import { IAccountUrlParams } from '../utils/types';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { TEST_BACKEND_URL, signOutWithFirebase } from '../utils/api';
import { HOME } from "../constants";

// custom components
import NavigationBar from "../components/NavigationBar";
import UpdateProfileInfoForm from "../components/UpdateProfileInfoForm";
import LoadingScreen from "./LoadingScreen";

// styling
import styles from '../styles/AccountScreen.module.css';

// material ui
import Button from '@mui/material/Button';

const AccountScreen = () => {
   let params: IAccountUrlParams = useParams();
   const { logOutFunction } = useContext(AuthContext);
   const history = useHistory();
   const [ editModeActive, setEditMode ] = useState<boolean>(false);
   const [ editString, setEditString ] = useState<string>('Edit Profile Info');
   const [ loading, setLoading ] = useState<boolean>(false);

   const onEditProfileClick = () => {
      if (!editModeActive) {
         setEditString('Cancel');
      } else {
         setEditString('Edit Profile Info');   
      }
      setEditMode(!editModeActive);
   }
   const onlogOutButtonClick = () => {
      signOutWithFirebase();
      logOutFunction();
      history.push(HOME);
   }

   const clickedStripe = () => {
      setLoading(true);
   }

   if (loading) {
      return ( <LoadingScreen /> )
   }
   return (
      <div>
         <NavigationBar />
      
         <div className={styles.containerWrapper}>
            
            <Button sx={{ marginBottom: 3, width: 300}} onClick={() => onEditProfileClick()} variant="contained">{editString}</Button>
            { (editModeActive) ? <UpdateProfileInfoForm /> : null }

            <a onClick={() => clickedStripe()} className={styles.link} href={`${TEST_BACKEND_URL}/connect_seller/${params.accountId}`} >
               <Button sx={{ marginBottom: 3, width: 300}} variant="contained">Start Selling on Draw Party</Button>
            </a>

            <Button sx={{ marginBottom: 3, width: 300}} onClick={() => onlogOutButtonClick()} variant="contained">Log Out</Button>

         </div>
         
      </div>
   )
}
export default AccountScreen;