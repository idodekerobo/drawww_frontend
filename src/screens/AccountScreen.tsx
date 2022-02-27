// react/npm
import { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

// api/utils
import { IAccountUrlParams } from '../utils/types';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { BACKEND_URL, signOutWithFirebase } from '../utils/api';
import { HOME } from "../constants";

// custom components
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import UpdateProfileInfoForm from "../components/UpdateProfileInfoForm";
import LoadingScreen from "./LoadingScreen";

// styling
import styles from '../styles/AccountScreen.module.css';

// material ui
import Button from '@mui/material/Button';

const AccountScreen = () => {
   let params: IAccountUrlParams = useParams();
   const { user, logOutFunction } = useContext(AuthContext);
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

   useEffect(() => {
   }, [ user ])

   if (loading) {
      return ( <LoadingScreen /> )
   }

   // const updateProfileInfoProps = {
   //    userUid: params.accountId
   // }
   return (
      <div>
         <NavigationBar />
      
         <div className={styles.containerWrapper}>
            
            <Button sx={{ marginBottom: 3, width: 300}} onClick={() => onEditProfileClick()} variant="contained">{editString}</Button>
            { (editModeActive) ? <UpdateProfileInfoForm /> : null }

            <Button sx={{ marginBottom: 3, width: 300}} onClick={() => onlogOutButtonClick()} variant="contained">Log Out</Button>

         </div>
         <div style={{marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
         
      </div>
   )
}
export default AccountScreen;