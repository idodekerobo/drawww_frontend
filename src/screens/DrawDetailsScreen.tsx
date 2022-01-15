import { useEffect, useState, useContext } from "react";
import { Timestamp, DocumentData, onSnapshot, doc } from "firebase/firestore";
import { firestoreDb } from '../utils/firebase';

// stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// custom components
import NavigationBar from "../components/NavigationBar";
import CountdownTimer from '../components/CountdownTimer';
import Footer from '../components/Footer';
import { useParams, useHistory } from "react-router-dom";

// styles
import styles from '../styles/DrawDetailsScreen.module.css'

// utils
import { BACKEND_URL, raffleCollectionName, getRaffleImagesFromStorage } from '../utils/api';
import { IDrawUrlParams, IDrawDataFromFirestoreType, IUserTransactionObject } from '../utils/types';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { HOME, LOGIN } from '../constants';

// material ui
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';


const initDrawState = {
   userUid: '',
   raffleSneakerBrand: '',
   raffleSneakerName: '',
   raffleSneakerSize: '',
   raffleDuration: 0,
   numTotalRaffleTickets: 0,
   pricePerRaffleTicket: 0,
   id: '',
   numRemainingRaffleTickets: 0,
   soldRaffleTickets: 0,
   raffleType: '',
   timeRaffleCreated: Timestamp.now(),
   raffleExpirationDate: Timestamp.now(),
}

const initDrawUrlArr: string[] = []

const DrawDetailsScreen = () => {
   const params: IDrawUrlParams = useParams();
   const { user } = useContext(AuthContext);
   const history = useHistory();
   const stripe = useStripe();
   const stripeElements = useElements();
   const [drawData, setDrawData] = useState<IDrawDataFromFirestoreType | DocumentData>(initDrawState)
   const [ drawImageUrls, setDrawImageUrls ] = useState(initDrawUrlArr);
   const [amountOfTickets, setAmountOfTickets] = useState(1);
   const [ chances, setChances ] = useState(0);

   const [ nameOnCard, setNameOnCard ] = useState('');
   const [ emailAddress, setEmailAddress ] = useState('');
   const [enterDrawButtonDisabled, setEnterDrawButtonDisabled] = useState(false);
   const [ openDialog, setDialog ] = useState(false);
   const [ showProgressSpinner, setShowProgressSpinner ] = useState(false);
   const [ confirmPaymentButtonDisabled, setConfirmPaymentButtonDisabled ] = useState(false);


   const handleClickDialogOpen = () => {
      if (!user) {
         history.push(LOGIN);
         return;
      }
      setDialog(true);
      setEnterDrawButtonDisabled(true);
   };

   const handleDialogClose = () => {
      setDialog(false);
      setNameOnCard('');
      setEnterDrawButtonDisabled(false);
      setConfirmPaymentButtonDisabled(false);
      setShowProgressSpinner(false);
   };

   const onInputChange = (value: string) => {
      const valueCastToNum = Number(value);
      setAmountOfTickets(valueCastToNum);
   }
   const addTicketClick = () => {
      const newValue = amountOfTickets + 1;
      setAmountOfTickets(newValue);
   }

   const minusTicketClick = () => {
      if (amountOfTickets <= 1) return;
      const newValue = amountOfTickets - 1;
      setAmountOfTickets(newValue);
   }

   const confirmPayButtonClick = async () => {
      setConfirmPaymentButtonDisabled(true);
      setShowProgressSpinner(true);
      if (!user) {
         alert('Please log in or make an account before entering draw!')
         handleDialogClose();
         return;
      }
      if (amountOfTickets <= 0 || !stripe) {
         alert('Tickets need to be more than 0 to buy')
         handleDialogClose();
         setAmountOfTickets(1);
         return;
      };
      const drawId = params.drawId;
      const CHECKOUT_URL = `${BACKEND_URL}/checkout/${drawId}`

      if (!stripe || !stripeElements) return;
      const response = await fetch(CHECKOUT_URL, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json'
         },
         body: JSON.stringify({
            amountOfTicketsPurchased: amountOfTickets,
            receipt_email: emailAddress,
         })
      })
      // console.log(response);
      if (response.status >= 400) {
         alert('There was an error making the payment, please try again later!');
         alert(response.statusText);
         handleDialogClose();
         return;
      }
      const paymentIntentResponse = await response.json();

      const card = stripeElements.getElement(CardElement);
      if (card) {
         const paymentResult = await stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
               card,
               billing_details: { name: nameOnCard },
            },
            receipt_email: emailAddress
         })

         if (paymentResult.error) {
            alert(`There was an error, please try again later. ${paymentResult.error.message}`);
            handleDialogClose()
            // console.log('error with the payment')
            // console.log(paymentResult.error.message)
         } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
               
               const orderData: IUserTransactionObject = {
                  nameOnCard,
                  emailAddress,
                  stripePaymentIntentId: paymentIntentResponse.id,
                  sellerStripeAcctId: paymentIntentResponse.sellerStripeAcctId,
                  ticketsSold: paymentIntentResponse.newTicketsSold,
                  sellerUserId: paymentIntentResponse.sellerUserId,
                  drawId,
                  buyerUserId: user.uid,
                  // add data for dollar amounts
                  subtotalDollarAmount: paymentIntentResponse.subtotalDollarAmount,
                  taxDollarAmount: paymentIntentResponse.taxDollarAmount,
                  totalDollarAmount: paymentIntentResponse.totalDollarAmount,
               }
               const POST_TXN_LOGIC_URL = `${BACKEND_URL}/checkout/${drawId}/success`;
               const postTxnLogicResp = fetch(POST_TXN_LOGIC_URL, {
                  method: 'POST',
                  headers: {
                     'Content-type': 'application/json'
                  },
                  body: JSON.stringify({ 
                     orderData,
                     ticketsRemaining: paymentIntentResponse.ticketsRemaining,
                     ticketsSoldAlready: paymentIntentResponse.ticketsSoldAlready
                  })
               })
               if (response.status >= 400) {
                  // TODO - run some retry logic here
               }
               alert('Thank you! Payment successfully went through!');
               setConfirmPaymentButtonDisabled(false);
               setShowProgressSpinner(false);
               history.push(HOME);
            }
         }
      } else {
         alert('There was an issue on our end. Please try again later!');   
         handleDialogClose();
      }
      handleDialogClose();
   }

   useEffect(() => {
      const unsub = onSnapshot(doc(firestoreDb, raffleCollectionName, params.drawId), async (doc) => {
         const newDrawData = doc.data();
         if (newDrawData) setDrawData(newDrawData);
         const raffleImagesUrlArr = await getRaffleImagesFromStorage(params.drawId);
         setDrawImageUrls(raffleImagesUrlArr);
      })
      return () => unsub();
   }, [ setDrawData, params.drawId ])

   useEffect(() => {
      if (!drawData) return;
      const chances: number = ( (1 / drawData.numTotalRaffleTickets)*100 );
      setChances(chances);
   }, [ drawData ])

   return (
      <>
         <NavigationBar />
         
         <div className={styles.contentContainer}>

            <div className={styles.mediaContainer}>
               <Card sx={{ maxWidth: 600 }}>
                  <CardMedia
                     component="img"
                     height="140"
                     src={drawImageUrls[(drawImageUrls.length-1)]}
                     alt="sneaker draw"
                  />
               </Card>
            </div>
            
            <div className={styles.infoContainer}>
               <div className={styles.numberOfRaffleTicketContainer}>
                  <div className={styles.numControlContainer}>
                     <ControlPointIcon className={styles.icon} onClick={() => addTicketClick()} />
                     <TextField
                        sx={{ width: 150, }}
                        size="small"
                        required
                        type="number"
                        id="outlined-required"
                        label="Tickets"
                        value={amountOfTickets}
                        onChange={(e) => onInputChange(e.target.value)}
                     />
                     <RemoveCircleOutlineIcon className={styles.icon} onClick={() => minusTicketClick()} />
                  </div>
                  <Button sx={{ width: '90%', height: 45, fontSize: 20 }} className={styles.enterDrawButton} onClick={() => handleClickDialogOpen()} variant="contained" disabled={enterDrawButtonDisabled}>
                     Enter Draw
                  </Button>
               </div>

               <div className={styles.raffleDetailsContainer}>
                  <Typography gutterBottom variant="h5" component="div">
                     {drawData.raffleSneakerBrand} {drawData.raffleSneakerName}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                     <span className={styles.timeLeftFlag}>Time Left:</span>
                     <span className={styles.timeLeft}>
                        <CountdownTimer raffleExpirationDate={drawData.raffleExpirationDate} />
                     </span>
                  </Typography>
                  <Typography variant="subtitle1" >
                     Remaining tickets: {drawData.numRemainingRaffleTickets}
                  </Typography>
                  <Typography variant="body1">
                     {drawData.sneakerGender === 0 ? "Men's" : "Women's"}, Size: {drawData.raffleSneakerSize}
                  </Typography>
                  <Typography variant="body1">
                     Price Per Ticket: ${drawData.pricePerRaffleTicket}
                  </Typography>
                  <Typography variant="body1">
                     1 Ticket = {chances}% Chance To Win
                  </Typography>
               </div>
            </div>
               
            <FormDialog 
               nameOnCard={nameOnCard}
               setNameOnCard={setNameOnCard}
               emailAddress={emailAddress}
               setEmailAddress={setEmailAddress}
               openDialog={openDialog}
               handleDialogClose={handleDialogClose}
               amountOfTickets={amountOfTickets} 
               pricePerTicket={drawData.pricePerRaffleTicket}
               confirmPaymentButtonDisabled={confirmPaymentButtonDisabled}
               showProgressSpinner={showProgressSpinner}
               confirmPayButtonClick={confirmPayButtonClick}
            />
         </div>
         <div className={styles.disclaimerContainer}>
            <p className={styles.disclaimerTitle}>*Please read*</p>
            <p className={styles.disclaimerBody}>The winner will be chosen live on Drawww's instagram page on Monday, 1/17/22 at 10am EST.</p>
            <p className={styles.disclaimerBody}>When you purchase you will receive an email with your ticket number, please save that email to redeem your ticket.</p>
         </div>
         <div style={{marginTop: 5, marginBottom: 5 }}>
            <Footer />
         </div>

      </>
   )
}
export default DrawDetailsScreen;

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
const FormDialog = ({nameOnCard, setNameOnCard, emailAddress, setEmailAddress, openDialog, handleDialogClose, amountOfTickets, pricePerTicket, confirmPayButtonClick, confirmPaymentButtonDisabled, showProgressSpinner}: DialogProps) => {
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