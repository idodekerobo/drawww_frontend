// react/npm
import React, { useContext, useEffect, useState } from 'react';
import { onSnapshot, doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { firestoreDb } from '../utils/firebase';
import { updateUserProfileData, updateUserDataOnFirestore } from '../utils/api';
import { IUserData } from '../utils/types';
import { HOME } from '../constants';

// styles 
import styles from '../styles/UpdateProfileInfoForm.module.css'

// material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const UpdateProfileInfoForm = () => {

   const { user } = useContext(AuthContext);
   const history = useHistory();

   const [name, setName] = useState('');
   const [phoneNum, setPhoneNum] = useState('');
   const [city, setCity] = useState('');
   const [state, setState] = useState('');
   const [zipCode, setZipCode] = useState('');
   const [shoeGender, setShoeGender] = useState(0)
   const [shoeSize, setShoeSize] = useState('')

   const onUpdateProfileClick = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const photoUrlNullPlaceholder = null;
      if (user) {
         updateUserProfileData(user, name, photoUrlNullPlaceholder);
         const newUserData = {
            name, phoneNum, city, state, zipCode, shoeGender, shoeSize
         }
         updateUserDataOnFirestore(user.uid, newUserData);
         alert('Profile has been updated!');
         history.push(HOME);
      } else {
         alert(`Profile wasn't able to update! Please try again later.`);
      }
   }

   useEffect(() => {
      if (!user) return;
      const unsub = onSnapshot(doc(firestoreDb, 'users', user.uid), async (doc) => {
         if (doc.exists()) {
            const newUserData = doc.data() as IUserData;
            setName(newUserData.name);
            setPhoneNum(newUserData.phoneNum);
            setCity(newUserData.city);
            setState(newUserData.state);
            setZipCode(newUserData.zipCode);
            setShoeGender(newUserData.shoeGender)
            setShoeSize(newUserData.shoeSize)
         }
      })
      return () => unsub();
   }, [ user, setName, setPhoneNum, setCity, setState, setZipCode, setShoeGender, setShoeSize ])

   return (
      <form className={styles.formContainer} onSubmit={onUpdateProfileClick}>
         <TextField sx={{ marginBottom: 3 }} label="Name" placeholder="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} label="Phone Number" placeholder="Phone Number" type="tel" variant="outlined" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} label="City" placeholder="City" variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} label="State" placeholder="State" variant="outlined" value={state} onChange={(e) => setState(e.target.value)} />
         <TextField sx={{ marginBottom: 3 }} label="Zip Code" placeholder="Zip Code" type="tel" variant="outlined" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />

         <RadioGroup sx={{ marginBottom: 3, display: 'inline' }} aria-label="shoe-gender" defaultValue={shoeGender} value={shoeGender} onChange={(e) => setShoeGender(Number(e.target.value))} name="sneaker-gender">
            <span className={styles.shoeSizeLabel}>Shoe Size:</span>
            <FormControlLabel sx={{marginRight: 3, marginLeft: 0}} value={1} control={<Radio />} label="Women's" />
            <FormControlLabel sx={{marginRight: 0, marginLeft: 2}} value={0} control={<Radio />} label="Men's" />
         </RadioGroup>

         <TextField sx={{ marginBottom: 3 }} label="Shoe Size" placeholder="Shoe Size" type="number" variant="outlined" value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} />

         <Button sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} type="submit" variant="contained">Update Profile</Button>
      </form>
   )
}
export default UpdateProfileInfoForm;