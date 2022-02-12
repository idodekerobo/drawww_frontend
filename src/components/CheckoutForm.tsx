// stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// styles
import styles from '../styles/DrawDetailsScreen.module.css'

// material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

interface DialogProps {
   nameOnCard: string,
   setNameOnCard: (name: string) => void,
   emailAddress: string,
   setEmailAddress: (email: string) => void,
   openDialog: boolean,
   handleDialogClose: () => void,
   amountOfTickets: number,
   pricePerTicket: number,
   confirmPayButtonClick: () => void,
   confirmPaymentButtonDisabled: boolean,
   showProgressSpinner: boolean,
}
const CheckoutForm = ({nameOnCard, setNameOnCard, emailAddress, setEmailAddress, openDialog, handleDialogClose, amountOfTickets, pricePerTicket, confirmPayButtonClick, confirmPaymentButtonDisabled, showProgressSpinner}: DialogProps) => {
   return (
      <div>
         <Dialog open={openDialog} onClose={handleDialogClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle sx={{ marginTop: 1 }}>Buy {amountOfTickets} Ticket(s)</DialogTitle>
            <DialogContent>
               <p className={styles.totalPriceText}>
                  Total: ${amountOfTickets * pricePerTicket}
               </p>

               { (showProgressSpinner) ? 
               <p style={{textAlign: 'center'}}><CircularProgress sx={{margin: 0}}/></p>
               :
                  <>
                     <TextField
                        sx={{ marginBottom: 2 }}
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        label="Email Address"
                        placeholder="Email where you'll get your receipt"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                     />
                     <TextField
                        sx={{ marginTop: 0, marginBottom: 2 }}
                        required
                        margin="dense"
                        id="name"
                        label="Name on Card"
                        placeholder="Name on card used"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                     />
                  </>
               }               
               <CardElement className={styles.cardElement} />
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
               <Button disabled={confirmPaymentButtonDisabled} sx={{ width: '80%', fontSize: 18, backgroundColor: 'black', color: 'white', marginBottom: 3 }} type="submit" onClick={confirmPayButtonClick}>Confirm Payment</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
export default CheckoutForm;