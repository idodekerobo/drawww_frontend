import React, { useEffect, useState, useContext } from 'react'
import Braintree, { Client, HostedFields, BraintreeError  } from 'braintree-web'
import { PaymentContext } from '../context/PaymentsContext/PaymentContext';
import { BACKEND_URL } from '../utils/api';
import { useHistory } from "react-router-dom";
import { HOME } from '../constants';
import styles from '../styles/CheckoutForm.module.css';

// material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';

interface DialogProps {
   openDialog: boolean,
   handleDialogClose: () => void,
   amountOfTickets: number,
   pricePerTicket: number,
   drawId: string,
   buyerUserId: string,
   drawSellerUserId: string,
}

// TODO - need to make sure that token isn't null before rendering checkout form
// TODO - need to make sure that form is rendered before initializing braintree

const CheckoutForm = ({ openDialog, handleDialogClose, amountOfTickets, pricePerTicket, drawId, buyerUserId, drawSellerUserId}: DialogProps) => {
   const history = useHistory();
   const totalPrice: number = amountOfTickets*pricePerTicket
   const paymentContext = useContext(PaymentContext);
   const { token } = paymentContext;
   
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

   const initializeBraintree = (braintreeToken: string) => {
      console.log('running init braintree function');
      const form = document.querySelector('#braintreeForm');
      // console.log(braintreeToken);
      Braintree.client.create({ authorization: token }, (err, braintreeClientInstance) => {
      // window.braintree.client.create({ authorization: braintreeToken }, (err, braintreeClientInstance) => {
         if (err) {
            if (err.code === "CLIENT_AUTHORIZATION_INVALID") {
               // token was expired or need a new one
               console.log('braintree auth invalid')
            }
            console.log('error initializing braintree');
            console.log(err);
            return;
         }
         console.log(form);
         if (!form) return;
         createHostedFields(braintreeClientInstance, form)
      })
   }
   const createHostedFields = (braintreeClient: Client, form: Element) => {
   // const createHostedFields = (braintreeClient: any, form: Element) => {
      console.log('create hosted fields function running');
      Braintree.hostedFields.create({
      // window.braintree.hostedFields.create({
         client: braintreeClient,
         styles: {
            'input': {
               'font-size': '16px',
               'font-family': 'courier, monospace',
               'font-weight': 'lighter',
               'color': '#ccc'
            },
            ':focus': {
               'color': 'black'
            },
            '.valid': {
               'color': '#8bdda8'
            }
         },
         fields: {
            number: {
               selector: '#card-number',
               placeholder: '4111 1111 1111 1111'
            },
            cvv: {
               selector: '#cvv',
               placeholder: '123'
            },
            expirationDate: {
               selector: '#expiration-date',
               placeholder: 'MM/YYYY'
            },
            postalCode: {
               selector: '#postal-code',
               placeholder: '11111'
            }
         }
      }, (err, hostedFieldsInstance) => {
         if (err) {
            console.log('error creating hosted fields instance');
            console.log(err);
         }
         console.log(hostedFieldsInstance)
      })
   }

   const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
   }

   const braintreeForm = (
      <form onSubmit={onFormSubmit} method="post" id="braintreeForm" >
      <label className="hosted-fields--label" htmlFor="card-number">Card Number</label>
      <div id="card-number" className="hosted-field"></div>

      <label className="hosted-fields--label" htmlFor="expiration-date">Expiration Date</label>
      <div id="expiration-date" className="hosted-field"></div>

      <label className="hosted-fields--label" htmlFor="cvv">CVV</label>
      <div id="cvv" className="hosted-field"></div>

      <label className="hosted-fields--label" htmlFor="postal-code">Postal Code</label>
      <div id="postal-code" className="hosted-field"></div>

      <div className="button-container">
         <input style={{ marginRight: 2 + 'px' }} type="submit" className="btn btn-primary" value="Purchase" id="submit" />
         &nbsp;<a style={{ marginRight: 2 + 'px' }} className="btn btn-warning">Cancel</a>
      </div>
   </form>)

   useEffect(() => {
      initializeBraintree(token);
   }, [ braintreeForm, token ])
   // useEffect(() => {
   //    initializeBraintree(token);
   // }, )



   return (
      <div>
         <Dialog keepMounted={true} open={openDialog} onClose={handleDialogClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle sx={{ marginTop: 1 }}>{amountOfTickets} Ticket(s), Total: ${totalPrice}</DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>

               {braintreeForm}
               {/* <form onSubmit={onFormSubmit} method="post" id="braintreeForm" >
                  <label className="hosted-fields--label" htmlFor="card-number">Card Number</label>
                  <div id="card-number" className="hosted-field"></div>

                  <label className="hosted-fields--label" htmlFor="expiration-date">Expiration Date</label>
                  <div id="expiration-date" className="hosted-field"></div>

                  <label className="hosted-fields--label" htmlFor="cvv">CVV</label>
                  <div id="cvv" className="hosted-field"></div>

                  <label className="hosted-fields--label" htmlFor="postal-code">Postal Code</label>
                  <div id="postal-code" className="hosted-field"></div>

                  <div className="button-container">
                     <input style={{ marginRight: 2 + 'px' }} type="submit" className="btn btn-primary" value="Purchase" id="submit" />
                     &nbsp;<a style={{ marginRight: 2 + 'px' }} className="btn btn-warning">Cancel</a>
                  </div>
               </form> */}

               <p>Clicking this enters you in the draw. When tickets are sold out or the draw closes you will be charged for the total amount.</p>
               <Button sx={{ width: '90%', height: 45, fontSize: 20 }} onClick={() => console.log('confirm draw entry')} variant="contained">
                  Confirm Entry of {amountOfTickets} Ticket(s)
               </Button>
            </DialogContent>
         </Dialog>
      </div>
   );
}
export default CheckoutForm;