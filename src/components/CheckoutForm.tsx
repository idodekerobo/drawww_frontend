import React, { useEffect, useState, useContext } from 'react'
import Braintree, { Dropin } from 'braintree-web-drop-in';
import { PaymentContext } from '../context/PaymentsContext/PaymentContext';
import { BACKEND_URL } from '../utils/api';
import { useHistory } from "react-router-dom";
import { HOME } from '../constants';
import styles from '../styles/CheckoutForm.module.css';

// material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface DialogProps {
   openDialog: boolean,
   handleDialogClose: () => void,
   amountOfTickets: number,
   pricePerTicket: number,
   drawId: string,
   buyerUserId: string,
   drawSellerUserId: string,
   numUserTickets: number | null,
   paymentMethodOnFile: boolean,
}

// TODO - need to make sure that token isn't null before rendering checkout form
// TODO - need to make sure that form is rendered before initializing braintree

const CheckoutForm = ({ openDialog, handleDialogClose, amountOfTickets, pricePerTicket, drawId, numUserTickets, buyerUserId, drawSellerUserId, paymentMethodOnFile }: DialogProps) => {
   // const history = useHistory();
   const totalPrice: number = (numUserTickets) ? (amountOfTickets-numUserTickets)*pricePerTicket : (amountOfTickets*pricePerTicket)
   const paymentContext = useContext(PaymentContext);
   const { token } = paymentContext;
   const [ dropinInstance, setDropinInstance ] = useState<null | Dropin>(null)
   const [ firstName, setFirstName ] = useState('');
   const [ lastName, setLastName ] = useState('');
   
   const validTxnCheck = async () => {
      const validTxn = await fetch(`${BACKEND_URL}/paypal_checkout/request/${drawId}`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            amountOfTicketsPurchased: amountOfTickets
         })
      })
      // TODO - check for error response and give user feedback here
      const validTxnJsonData = await validTxn.json();
      return validTxnJsonData;
   }

   const initDropin = (braintreeToken: string) => {
      Braintree.create({
         authorization: braintreeToken,
         container: '#braintree-dropin-container',
         paypal: {
            flow: 'vault'
         }
      }, (err, dropinInstance) => {
         if (err) {
            console.log('error creating drop in instance');
            console.log(err);
            // TODO - should i send the user home here so it auto refreshes ?? 
            // alert('There was a quick error! Please refresh the page')
            // return;
         } 
         // console.log('drop in instance');
         // console.log(dropinInstance);
         if (dropinInstance === undefined || null) return;
         setDropinInstance(dropinInstance);
      })
   }

   const enterDrawButton = (e: React.FormEvent<HTMLFormElement>, dropinInstance: Dropin | null) => {
      e.preventDefault();
      // console.log('clicked enter')
      // console.log(dropinInstance);
      if (!dropinInstance) return;
      dropinInstance.requestPaymentMethod(async (err, paymentData) => {
         console.log('sending payment data to server');
         if (err) {
            console.log('error sending payment to server')
            // TODO - give user feedback for errors
            console.log(err);
         }
         let amountOfNewTickets: number;
         if (numUserTickets) {
            amountOfNewTickets = amountOfTickets-numUserTickets;
         } else {
            amountOfNewTickets = amountOfTickets;
         }
         const testUrl = `http://localhost:5000/enter_draw/${drawId}/new_customer`;
         const responseUrl = await fetch(testUrl, {
            method: 'POST',
            headers: {
               'Content-type': 'application/json'
            },
            body: JSON.stringify({
               firstName,
               lastName,
               buyerUserId,
               paymentData,
               numberTicketsAcquired: amountOfNewTickets
            })
         })
         const response = await responseUrl.json();
         console.log(response);
      })
   }

   useEffect(() => {
      initDropin(token);
   }, [ token ])

   return (
      <div>
         <Dialog keepMounted={true} open={openDialog} onClose={handleDialogClose} fullWidth={true} maxWidth={'sm'}>
            {(numUserTickets) ?
               (numUserTickets > 0) ?
                  <>
                     <DialogTitle sx={{ marginTop: 1 }}>Buy {amountOfTickets-numUserTickets} more ticket(s), Total: ${totalPrice}</DialogTitle>   
                     <DialogTitle sx={{ fontSize: 14, marginTop: -2, marginBottom: 0, paddingTop: 0, paddingBottom: 3, }}>You already have {numUserTickets} ticket(s) for ${numUserTickets*pricePerTicket}.</DialogTitle>
                  </>
               :
               <DialogTitle sx={{ marginTop: 1 }}>{amountOfTickets} Ticket(s), Total: ${totalPrice}</DialogTitle>
               :
               <DialogTitle sx={{ marginTop: 1 }}>{amountOfTickets} Ticket(s), Total: ${totalPrice}</DialogTitle>
            }
            <DialogContent sx={{ textAlign: 'center' }}>

            <form className={styles.userInputForm} onSubmit={(e) => enterDrawButton(e, dropinInstance)}>
               <TextField
                     sx={{ marginBottom: 1 }}
                     required
                     type="text"
                     label="First Name"
                     placeholder="First Name"
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                     sx={{ marginBottom: 2 }}
                     required
                     type="text"
                     label="Last Name"
                     placeholder="Last Name"
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                  />
                  {(paymentMethodOnFile) ?
                     <></>
                     :
                     <div id="braintree-dropin-container"></div>
                  }

                  <Button type="submit" sx={{ width: '90%', height: 65, fontSize: 20, marginRight: 'auto', marginLeft: 'auto' }} variant="contained">
                     Confirm Entry of {amountOfTickets} Ticket(s)
                  </Button>
               </form>
               <p>Clicking this enters you in the draw. When tickets are sold out or the draw closes you will be charged for the total amount.</p>
            </DialogContent>
         </Dialog>
      </div>
   );
}
export default CheckoutForm;