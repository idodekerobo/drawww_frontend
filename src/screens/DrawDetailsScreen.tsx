import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Timestamp, DocumentData, onSnapshot, doc } from "firebase/firestore";
import { firestoreDb } from '../utils/firebase';

// custom components
import NavigationBar from "../components/NavigationBar";
import CheckoutForm from "../components/CheckoutForm";
// import ReturningCustomerCheckoutForm from "../components/ReturningCustomerCheckoutForm";
import CountdownTimer from '../components/CountdownTimer';
import Footer from '../components/Footer';
import { useParams, useHistory } from "react-router-dom";

// styles
import styles from '../styles/DrawDetailsScreen.module.css'

// utils
import { raffleCollectionName, getRaffleImagesFromStorage, checkIfUserHasDrawTickets, getUserDataObjectFromUid } from '../utils/api';
import { IDrawUrlParams, IDrawDataFromFirestoreType } from '../utils/types';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { LOGIN } from '../constants';

// react spinner
import ClipLoader from "react-spinners/ClipLoader"; 
// material ui
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
   const [drawData, setDrawData] = useState<IDrawDataFromFirestoreType | DocumentData>(initDrawState)
   const [ drawImageUrls, setDrawImageUrls ] = useState(initDrawUrlArr);
   const [amountOfTickets, setAmountOfTickets] = useState(1);
   const [ chances, setChances ] = useState(0);

   const [enterDrawButtonDisabled, setEnterDrawButtonDisabled] = useState(false);
   const [ openDialog, setDialog ] = useState(false);

   const [ numUserTickets, setNumUserTickets ] = useState<null | number>(null);
   const [ paymentMethodOnFile, setPaymentMethodOnFile ] = useState(false);


   const handleClickDialogOpen = () => {
      if (!user) {
         alert('Please log in or make an account before entering draw!')
         history.push(LOGIN);
         return;
      }
      if (amountOfTickets <= 0) {
         alert('Tickets need to be more than 0!')
         return;
      }
      if (numUserTickets) {
         if (amountOfTickets <= numUserTickets) {
            alert(`You already have ${numUserTickets} tickets!If you want more specify the correct amount.`)
            return;
         }
      }
      setDialog(true);
      setEnterDrawButtonDisabled(true);
   };

   const handleDialogClose = () => {
      setDialog(false);
      setEnterDrawButtonDisabled(false);
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

   useEffect(() => {
      if (!user) {
         setNumUserTickets(0);
         return;
      };
      const checkForTickets = async () => {
         const numTickets = await checkIfUserHasDrawTickets(user.uid, params.drawId);
         setNumUserTickets(numTickets);
         if (numTickets > 0) setAmountOfTickets(numTickets)
      }
      checkForTickets();
   }, [user, params.drawId])

   useEffect(() => {
      if (!user) return;
      const isPaymentMethodOnFile = async () => {
         const userData = await getUserDataObjectFromUid(user.uid);
         if (!userData) return;
         const paymentData = userData?.paymentData;
         if (!paymentData) return;
         const braintree = paymentData['braintree']
         const token = braintree['paymentToken'];
         if (token) setPaymentMethodOnFile(true)
      }
      isPaymentMethodOnFile();
   }, [ user ])

   return (
      <>
         <Helmet>
            <title> {drawData.raffleSneakerBrand} {drawData.raffleSneakerName} Raffle and Draw Tickets | Drawww</title>
            <meta name="description" content="Raffle and draw tickets for Jordan's, Dunks, New Balances, Yeezy's and more" />
            <link rel="canonical" href={window.location.href} />
         </Helmet>
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
               <div className={styles.raffleTicketLogicContainer}>

                  {(numUserTickets == null) ?
                     <ClipLoader speedMultiplier={0.45} color={"black"} loading={true} size={35} />
                  : (numUserTickets > 0) ?
                     <div className={styles.numberOfRaffleTicketContainer}>
                        <div className={styles.numControlContainer}>
                           <ControlPointIcon className={styles.icon} onClick={() => addTicketClick()} />
                           <TextField
                              sx={{ width: 150, color: 'black', }}
                              size="small"
                              type="number"
                              label="Current Tickets"
                              value={amountOfTickets}
                              onChange={(e) => onInputChange(e.target.value)}
                           />
                           <RemoveCircleOutlineIcon className={styles.icon} onClick={() => minusTicketClick()} />
                        </div>
                        <Button sx={{ width: '90%', height: 45, fontSize: 20 }} variant="contained" onClick={() => handleClickDialogOpen()}  disabled={enterDrawButtonDisabled}>
                           Update Tickets
                        </Button>
                     </div>
                  :
                     (<div className={styles.numberOfRaffleTicketContainer}>
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
                     </div>)
                  }
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
               
            <CheckoutForm
               openDialog={openDialog}
               handleDialogClose={handleDialogClose}
               drawId={params.drawId}
               numUserTickets={numUserTickets}
               amountOfTickets={amountOfTickets} 
               pricePerTicket={drawData.pricePerRaffleTicket}
               buyerUserId={(user) ? user.uid : ''}
               drawSellerUserId={drawData.userUid}
               paymentMethodOnFile={paymentMethodOnFile}
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