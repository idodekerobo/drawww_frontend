// react/npm
import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { updateUserProfileData, updateUserDataOnFirestore } from '../utils/api';
import { HOME } from '../constants';

// styles 
import styles from '../styles/UpdateProfileInfoForm.module.css'

// material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const UpdateProfileInfoForm = () => {

   const { user } = useContext(AuthContext);
   const history = useHistory();

   const [name, setName] = useState('');
   const [phoneNum, setPhoneNum] = useState('');
   const [city, setCity] = useState('');
   const [state, setState] = useState('');
   const [zipCode, setZipCode] = useState('');

   const onUpdateProfileClick = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const photoUrlNullPlaceholder = null;
      if (user) {
         updateUserProfileData(user, name, photoUrlNullPlaceholder);
         const userDataObject = {
            name, phoneNum, city, state, zipCode
         }
         updateUserDataOnFirestore(user.uid, userDataObject);
         alert('Profile has been updated!');
         history.push(HOME);
      } else {
         alert(`Profile wasn't able to update! Please try again later.`);
      }
   }

   return (
      <form className={styles.formContainer} onSubmit={onUpdateProfileClick}>
         <TextField sx={{ marginBottom: 3 }} id="outlined-basic" label="Name" placeholder="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} id="outlined-basic" label="Phone Number" placeholder="Phone Number" type="tel" variant="outlined" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} id="outlined-basic" label="City" placeholder="City" variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} id="outlined-basic" label="State" placeholder="State" variant="outlined" value={state} onChange={(e) => setState(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} id="outlined-basic" label="Zip Code" placeholder="Zip Code" type="tel" variant="outlined" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />

         <Button sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} type="submit" variant="contained">Update Profile</Button>
      </form>
   )
}
export default UpdateProfileInfoForm;