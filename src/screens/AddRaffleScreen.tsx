// npm/react
import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { addRaffleToFirestore } from '../utils/api';
import { HOME } from '../constants';

// custom components
import NavigationBar from '../components/NavigationBar';

// styles
import styles from '../styles/AddRaffleScreen.module.css';

// material ui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

const AddRaffleScreen = () => {
   const history = useHistory();
   const { user } = useContext(AuthContext);

   const [ submitButtonDisabled, setSubmitButtonDisabled ] = useState(false);

   const [ raffleDuration, setRaffleDuration ] = useState('7');
   const [ numRaffleTickets, setNumRaffleTickets ] = useState('20');
   const [ pricePerRaffleTicket, setPricePerRaffleTicket ] = useState('')
   const [ raffleSneakerBrand, setRaffleSneakerBrand ] = useState('');
   const [ raffleSneakerName, setRaffleSneakerName ] = useState('');
   const [ raffleSneakerSize, setRaffleSneakerSize ] = useState('');
   const [ raffleImages, setRaffleImages ] = useState<null | FileList>(null);

   const onSubmitRaffleClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitButtonDisabled(true);

      const numRaffleDuration = Number(raffleDuration);
      const numTotalRaffleTickets = Number(numRaffleTickets);
      const numPricePerRaffleTicket = Number(pricePerRaffleTicket);
      
      if (user) { // would have to use user?.uid below w/o the if block
         const userRaffleData = {
            userUid: user.uid,
            raffleDuration: numRaffleDuration,
            pricePerRaffleTicket: numPricePerRaffleTicket,
            numTotalRaffleTickets,
            raffleSneakerBrand, raffleSneakerName, raffleSneakerSize,
         }
         const completed = await addRaffleToFirestore(user.uid, userRaffleData, raffleImages);
         
         if (completed) {
            alert('Thanks for submitting the raffle!')
            history.push(HOME);
         } else {
            alert('Something went wrong! Please try again later!');
            setSubmitButtonDisabled(false);
         }
      }

   }

   return (
      <div>
         <NavigationBar />
         <div className={styles.containerWrapper}>

            <h3>Add A New Raffle</h3>
            <form className={styles.addRaffleFormContainer} onSubmit={onSubmitRaffleClick}>
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  // type="number"
                  id="outlined-required"
                  label="Brand"
                  placeholder="Brand"
                  value={raffleSneakerBrand}
                  onChange={(e) => setRaffleSneakerBrand(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  // type="number"
                  id="outlined-required"
                  label="Sneaker Name"
                  placeholder="Sneaker Name"
                  value={raffleSneakerName}
                  onChange={(e) => setRaffleSneakerName(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="number"
                  id="outlined-required"
                  label="Active Days"
                  placeholder="Days"
                  value={raffleDuration}
                  onChange={(e) => setRaffleDuration(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="number"
                  id="outlined-required"
                  label="Size (in men's)"
                  placeholder="Size"
                  value={raffleSneakerSize}
                  onChange={(e) => setRaffleSneakerSize(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="number"
                  id="outlined-required"
                  label="Total Raffle TIckets"
                  placeholder="Total Raffle Tickets"
                  value={numRaffleTickets}
                  onChange={(e) => setNumRaffleTickets(e.target.value)}
               />
               <TextField
                  sx={{ marginBottom: 3 }}
                  required
                  type="number"
                  id="outlined-required"
                  label="Price Per Ticket"
                  placeholder="Price Per Ticket"
                  InputProps={{
                     startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={pricePerRaffleTicket}
                  onChange={(e) => setPricePerRaffleTicket(e.target.value)}
               />
               <label htmlFor="raffle_photos">
                  <input type='file' name="raffle_photos" accept="image/*" multiple onChange={e => setRaffleImages(e.target.files)}/>
               </label>

               <Button sx={{ marginTop: 3, marginBottom: 3, fontSize: 20, width: '100%' }} type="submit" variant="contained" disabled={submitButtonDisabled} >Submit</Button>
            </form>
         </div>
      </div>
   )
}
export default AddRaffleScreen;

/*
raffle data model
# raffle id key
   # user uid
   # duration
   # num raffle tickets avail
   # price per raffle ticket
   # tickets available (?? necessary ??)
   # raffle type
   # sneaker, clothes, etc.
   # raffle name
   # sneaker brand
   # men's or women's size
   # sneaker size (dependent on mens or womens flag?? ? ? )
   # sneaker name

   // auto defaults
   # time created 
   # end date/time
   # tickets sold

*/
