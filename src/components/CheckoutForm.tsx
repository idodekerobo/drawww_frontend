import { PayPalButtons } from '@paypal/react-paypal-js';
import { OnApproveData, OnApproveActions, OrderResponseBody, CreateOrderActions, /* CreateOrderRequestBody, */ } from '@paypal/paypal-js';
import { BACKEND_URL } from '../utils/api';
import { useNavigate } from "react-router-dom";
import { HOME } from '../constants';

// material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface DialogProps {
   openDialog: boolean,
   handleDialogClose: () => void,
   amountOfTickets: number,
   pricePerTicket: number,
   drawId: string,
   buyerUserId: string,
   drawSellerUserId: string,
}
const CheckoutForm = ({ openDialog, handleDialogClose, amountOfTickets, pricePerTicket, drawId, buyerUserId, drawSellerUserId}: DialogProps) => {
   const navigate = useNavigate();
   const totalPrice: number = amountOfTickets*pricePerTicket
   
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

   const createPaypalOrder = async (data: any, actions: CreateOrderActions) => {
      const txnData = await validTxnCheck();
      if (txnData.valid) {
         return actions.order.create({
            purchase_units: [
               { amount: { value: (txnData.totalDollarAmount).toString() } },
            ]
         })
         .then(orderId => {
            return orderId;
         })
         .catch(err => {
            console.log('error caught. see below.')
            console.log(err);
            navigate(HOME);
            return 'error caught. see below.';
         });
      } else {
         alert('This purchase isn\'t valid! If the site isn\'t working like it is supposed to, email idode@drawww.xyz or reach out to the Drawww social media.');
         navigate(HOME);
         return 'Purchase isn\'t valid.';
      }
   }
   const onOrderApproval = (data: OnApproveData, actions: OnApproveActions) => {
      if (actions !== undefined && actions.order !== undefined) {
         return actions.order.capture().then( (details: OrderResponseBody) => {
            const name = details.payer.name.given_name;
            const userOrderData = {
               buyerUserId,
               buyerEmailAddress: details.payer.email_address,
               buyerPayerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
               paypalOrderId: details.id,
               paypalOrderData: details,
               drawId,
               ticketsSold: amountOfTickets,
               sellerUserId: drawSellerUserId,
            }

            fetch(`${BACKEND_URL}/paypal_checkout/success`, {
               method: 'POST',
               headers: {
                  'Content-type': 'application/json',
               },
               body: JSON.stringify({
                  userOrderData,
               })
            })

            handleDialogClose();
            alert(`${name}, your purchase was successful!`);
            navigate(HOME);
         }).catch(err => {
            handleDialogClose();
            alert('There was an error approving the order! Please email idode@drawww.xyz')
            navigate(HOME);
            console.log('err w/ approving payments')
            console.log(err);
         })
      } else {
         return new Promise<void>((resolve) => {
            resolve()
         })
      }
   }

   return (
      <div>
         <Dialog open={openDialog} onClose={handleDialogClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle sx={{ marginTop: 1 }}>{amountOfTickets} Ticket(s), Total: ${totalPrice}</DialogTitle>
            <DialogContent>
               {/* <PayPalButtons 
                  createOrder={createPaypalOrder}
                  onApprove={onOrderApproval}
               /> */}
            </DialogContent>
         </Dialog>
      </div>
   );
}
export default CheckoutForm;