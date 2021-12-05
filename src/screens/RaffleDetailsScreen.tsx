import { useEffect, useState, useContext } from "react";
import { Timestamp, DocumentData } from "firebase/firestore";

// stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// custom components
import NavigationBar from "../components/NavigationBar";
import { useParams, useHistory } from "react-router-dom";

// styles
import styles from '../styles/RaffleDetailsScreen.module.css'

// utils
import { TEST_BACKEND_URL, grabOneRaffleFromFirestore, getRaffleImagesFromStorage, updateTicketsAvailableInRaffle, addTransactionToFirestore, } from '../utils/api';
import { IRaffleUrlParams, IRaffleDataFromFirestoreType, IUserOrderObject } from '../utils/types';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { HOME } from '../constants';

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
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const initRaffleState = {
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

const initRaffleUrlArr: string[] = []

const RaffleDetailsScreen = () => {
   const params: IRaffleUrlParams = useParams();
   const { user } = useContext(AuthContext);
   const history = useHistory();
   const stripe = useStripe();
   const stripeElements = useElements();
   const [raffleData, setRaffleData] = useState<IRaffleDataFromFirestoreType | DocumentData>(initRaffleState)
   const [ raffleImageUrls, setRaffleImageUrls ] = useState(initRaffleUrlArr);
   const [amountOfTickets, setAmountOfTickets] = useState(1);

   const [ nameOnCard, setNameOnCard ] = useState('');
   const [ emailAddress, setEmailAddress ] = useState('');
   const [buyButtonDisabled, setBuyButtonDisabled] = useState(false);

   const [ openDialog, setDialog ] = useState(false);

   const handleClickDialogOpen = () => {
      setDialog(true);
      setBuyButtonDisabled(true);
   };

   const handleDialogClose = () => {
      setDialog(false);
      setNameOnCard('');
      setBuyButtonDisabled(false);
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

   const buyButtonClick = async () => {
      if (!user) {
         alert('Please log in or make an account before purchasing!')
         handleDialogClose();
         return;
      }
      if (amountOfTickets <= 0 || !stripe) {
         alert('Tickets need to be more than 0 to buy')
         handleDialogClose();
         setAmountOfTickets(1);
         return;
      };
      const raffleId = params.raffleId;
      const API_URL = `${TEST_BACKEND_URL}/checkout/${raffleId}`

      if (!stripe || !stripeElements) return;
      const response = await fetch(API_URL, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json'
         },
         body: JSON.stringify({
            amountOfTicketsPurchased: amountOfTickets
         })
      })
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
            console.log('error with the payment')
            console.log(paymentResult.error.message)
         } else {
            if (paymentResult.paymentIntent.status === 'succeeded') {
               alert('Thank you! Payment successfully went through!');

               updateTicketsAvailableInRaffle(raffleId, paymentIntentResponse.ticketsSold, paymentIntentResponse.ticketsRemaining);
               
               const orderData: IUserOrderObject = {
                  stripePaymentIntentId: paymentIntentResponse.id,
                  sellerStripeAcctId: paymentIntentResponse.sellerStripeAcctId,
                  ticketsSold: paymentIntentResponse.ticketsSold,
                  sellerUserId: paymentIntentResponse.sellerUserId,
                  raffleId,
                  buyerUserId: user.uid,
               }
               addTransactionToFirestore(orderData)
               
               // TODO - redirect to another page
               history.push(HOME);


            }
         }
      }
      handleDialogClose();
   }

   useEffect(() => {
      const setRaffle = async () => {
         let raffle;
         if (params.raffleId) {
            raffle = await grabOneRaffleFromFirestore(params.raffleId);
            if (raffle) setRaffleData(raffle);
            const raffleImagesUrlArr = await getRaffleImagesFromStorage(params.raffleId);
            setRaffleImageUrls(raffleImagesUrlArr);
         }
      }
      setRaffle();
   }, [ params.raffleId ])

   return (
      <>

         <NavigationBar />
         
         <div className={styles.contentContainer}>

            <div className={styles.mediaContainer}>
               <Card sx={{ maxWidth: 600 }}>
                  {/* <CardActionArea> */}
                  <CardMedia
                     component="img"
                     height="140"
                     src={raffleImageUrls[(raffleImageUrls.length-1)]}
                     alt="sneaker raffle"
                  />
                  {/* </CardActionArea> */}
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
                  <Button sx={{ width: '60%', height: 45, fontSize: 20 }} className={styles.buyButton} onClick={() => handleClickDialogOpen()} variant="contained" disabled={buyButtonDisabled}>Buy</Button>
               </div>

               <div className={styles.raffleDetailsContainer}>
                  <Typography gutterBottom variant="h5" component="div">
                     {raffleData.raffleSneakerBrand} {raffleData.raffleSneakerName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                     Price Per Ticket: ${raffleData.pricePerRaffleTicket}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                     Remaining tickets: {raffleData.numRemainingRaffleTickets}
                  </Typography>
                  
               </div>
            </div>
               
            <FormDialog 
               nameOnCard={nameOnCard}
               setNameOnCard={setNameOnCard}
               emailAddress={emailAddress}
               setEmailAddress={setEmailAddress}
               openDialog={openDialog}
               handleClickDialogOpen={handleClickDialogOpen}
               handleDialogClose={handleDialogClose}
               amountOfTickets={amountOfTickets} 
               pricePerTicket={raffleData.pricePerRaffleTicket}
               buyButtonClick={buyButtonClick}
            />
         </div>

      </>
   )
}
export default RaffleDetailsScreen;

interface DialogProps {
   nameOnCard: string,
   setNameOnCard: (name: string) => void,
   emailAddress: string,
   setEmailAddress: (email: string) => void,
   openDialog: boolean,
   handleClickDialogOpen: () => void,
   handleDialogClose: () => void,
   amountOfTickets: number,
   pricePerTicket: number,
   buyButtonClick: () => void,
}
const FormDialog = ({nameOnCard, setNameOnCard, emailAddress, setEmailAddress, openDialog, handleClickDialogOpen, handleDialogClose, amountOfTickets, pricePerTicket, buyButtonClick}: DialogProps) => {
   return (
      <div>
         <Dialog open={openDialog} onClose={handleDialogClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>Buy {amountOfTickets} Tickets</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  Total: ${amountOfTickets * pricePerTicket}
               </DialogContentText>
               
                  <TextField
                     autoFocus
                     required
                     margin="dense"
                     id="email"
                     label="Email Address"
                     placeholder="Enter the email where you'd like to see your receipt"
                     type="email"
                     fullWidth
                     variant="standard"
                     value={emailAddress}
                     onChange={(e) => setEmailAddress(e.target.value)}
                  />
                  <TextField
                     autoFocus
                     required
                     margin="dense"
                     id="name"
                     label="Name on Card"
                     placeholder="Enter the name on the card being used"
                     type="text"
                     fullWidth
                     variant="standard"
                     value={nameOnCard}
                     onChange={(e) => setNameOnCard(e.target.value)}
                  />
                  <CardElement />
               
            </DialogContent>
            <DialogActions>
               <Button type="submit" onClick={buyButtonClick}>Submit Order</Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}