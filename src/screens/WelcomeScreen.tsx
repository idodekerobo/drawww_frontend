// npm
import { useContext, useState } from 'react';
import { Redirect } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { updateUserProfileData, updateUserDataOnFirestore } from '../utils/api';
import { LOGIN, HOME } from '../constants';
// material ui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// nav bar imports
import NavigationBar from '../components/NavigationBar';

const WelcomeScreen = () => {
   const { user, loggedIn } = useContext(AuthContext);

   const [ name, setName ] = useState('');
   const [ phoneNum, setPhoneNum ] = useState('');
   const [ city, setCity ] = useState('');
   const [ state, setState ] = useState('');
   const [ zipCode, setZipCode ] = useState('');

   const onUpdateProfileClick = () => {
      const photoUrlNullPlaceholder = null;
      if (user) {
         updateUserProfileData(user, name, photoUrlNullPlaceholder);
         const userDataObject = {
            name, phoneNum, city, state, zipCode
         }
         updateUserDataOnFirestore(user.uid, userDataObject);
      }
      return ( <Redirect to={HOME} /> )
   }

   if (!loggedIn) {
      return <Redirect to={LOGIN} />
   }
   
   return (
      <div>
         <NavigationBar />
         <Container maxWidth="xl">
            <h3>Thank you for signing up!</h3>
            <h3>
               Please fill out the below!
            </h3>

            <Box
               component="form"
               sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
               }}
               // noValidate
               autoComplete="off"
            >
               <TextField id="outlined-basic" label="Name" placeholder="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)}/>
               <TextField id="outlined-basic" label="Phone Number" placeholder="Phone Number" type="tel" variant="outlined" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
               <TextField id="outlined-basic" label="City" placeholder="City" variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} />
               <TextField id="outlined-basic" label="State" placeholder="State" variant="outlined" value={state} onChange={(e) => setState(e.target.value)} />
               <TextField id="outlined-basic" label="Zip Code" placeholder="Zip Code" type="tel" variant="outlined" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />

               <Button onClick={() => onUpdateProfileClick()} variant="contained">Update Profile</Button>
            </Box>
         </Container>

      </div>
   )
}
export default WelcomeScreen;
