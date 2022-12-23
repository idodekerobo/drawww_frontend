import React, { useEffect, useState } from 'react';
import styles from '../styles/EmailListDialog.module.css';
import { BACKEND_URL } from '../utils/api';
// material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const EmailListWrapperComponent = ({ children, redirectTo }: any) => {
   const [ dialogOpen, setDialogOpen ] = useState(false);
   const handleDialogClose = () => {
      setDialogOpen(false);
   }

   const fetchLsKey = async (): Promise<boolean> => {
      const firstVisit = await localStorage.getItem('firstVisit')
      if (!firstVisit) {
         setDialogOpen(true);
         localStorage.setItem('firstVisit', 'false')
         // console.log(firstVisit);
         return true
      } else {
         return false
      }
   }
   useEffect(() => {
      fetchLsKey();
   }, [ ])
   return (
      <EmailListDialog
         dialogOpen={dialogOpen}
         handleDialogClose={handleDialogClose}
      />
   )
}
export default EmailListWrapperComponent;

interface DialogProps {
   dialogOpen: boolean,
   handleDialogClose: () => void,
}
const EmailListDialog = ({ dialogOpen, handleDialogClose }: DialogProps) => {
   const [ emailAddress, setEmailAddress ] = useState('');
   const [ signedUp, setSignedUp ] = useState(false);
   
   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignedUp(true);
      console.log('add email to list');
      setTimeout(() => handleDialogClose(), 2500)
      await fetch(`${BACKEND_URL}/addEmail`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            emailAddress
         }),
      });
   }

   return (
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth={true} maxWidth={'sm'}>
         <p onClick={() => handleDialogClose()} className={styles.exitButton}>X</p>
         <DialogTitle>Drop your email to hear about new draws!</DialogTitle>
         <DialogContent>
            { (signedUp) ?
               <p style={{textAlign: 'center', marginTop: 55, marginBottom: 55, fontSize: 20}}>🤝 You'll be hearing from us 🤝</p>
            :
               <form onSubmit={onSubmit}>
                  <TextField
                     sx={{ marginBottom: 3, width: '100%' }}
                     required
                     type="email"
                     label="Email"
                     placeholder="Email"
                     value={emailAddress}
                     onChange={(e) => setEmailAddress(e.target.value)}
                  />
                  <Button sx={{ marginBottom: 3, fontSize: 18, width: '100%' }} type="submit" variant="contained">Sign Up</Button>
               </form>
            }
         </DialogContent>
      </Dialog>
   )  
}