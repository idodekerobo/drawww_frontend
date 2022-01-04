// npm/react
import { useState } from 'react';
// import { useHistory } from "react-router-dom";

// react router
import { Link } from "react-router-dom";

// api/utils
// import { AuthContext } from '../context/AuthContext/AuthContext';
import { START_SELLING } from '../constants';

// custom components
import NavigationBar from '../components/NavigationBar';
import SplashBar from '../components/SplashBar';

// material ui
import Button from '@mui/material/Button';

import styles from '../styles/FaqScreen.module.css';

const FaqScreen = () => {
   const [ q1Visible, setQ1Visible ] = useState(false);
   const [ q2Visible, setQ2Visible ] = useState(false);
   const [ q3Visible, setQ3Visible ] = useState(false);
   const [ q4Visible, setQ4Visible ] = useState(false);
   const [ q5Visible, setQ5Visible ] = useState(false);

   const question1 = <>{(q1Visible) ? 
      <ul>
         <li>Drawww is a platform where users can buy into and host their own paid Draws for sneakers. You can buy tickets to win Draws for sneakers that others post or list your own Draw to sell your sneakers.</li>
         <li>Each sneaker on Drawww is manually verified authentic before being listed on the platform and sent out to the winner of the Draw.</li>
      </ul>
   :
      null
   }</>

   const question2 = <>{(q2Visible) ? 
      <ul>
         <li>Right now, we're only open to a small number of sellers, but you can click the link below to join the waitlist!</li>
         <Button sx={{ marginTop: 1 }} variant="contained">
            <Link className={styles.link} to={START_SELLING}>
               Join Waitlist
            </Link>
         </Button>
      </ul>
   :
      null
   }</>

   const question3 = <>{(q3Visible) ?
      <ul>
         <li>When the Draw is finished, you'll get an email that tells you whether you won the Draw! In addition, you'll also get emailed receipts every time you buy tickets to a Draw.</li>
      </ul>
   :
      null
   }</>

   const question4 = <>{(q4Visible) ?
      <ul>
         <li>Each listing has their own expiration date and will remain open until either the expiration date or the Draw sells out of tickets - whichever comes first. When the Draw closes, everyone who bought tickets and the seller of the Draw will be notified and one buyer will be chosen at random to win the sneakers in the Draw!</li>
      </ul>
   :
      null
   }</>
   
   const question5 = <>{(q5Visible) ?
      <ul>
         <li>There are 3 W's because you will get W's on Drawww. This is not the SNKRS app.</li>
      </ul>
   :
      null
   }</>

   return (
      <div>
         <NavigationBar />
         <SplashBar splashBarText="FAQ's" />
         <div className={styles.faqContainer}>
            <ol>
               
               <div className={styles.questionContainer}>
                  <li>
                     <Button sx={{ marginBottom: 0, width: 260}} variant="contained" onClick={() => setQ1Visible(!q1Visible)}>
                        TF is Drawww??
                     </Button>
                  </li>
                  {question1}
               </div>

               <div className={styles.questionContainer}>
                  <li>
                     <Button sx={{ marginBottom: 0, width: 260}} variant="contained" onClick={() => setQ4Visible(!q4Visible)}>
                        How do Draws work?
                     </Button>
                  </li>
                  {question4}
               </div>

               <div className={styles.questionContainer}>
                  <li>
                     <Button sx={{marginBottom: 0, width: 260}} variant="contained" onClick={() => setQ3Visible(!q3Visible)}>
                        How do I know if I won?
                     </Button>
                  </li>
                  {question3}
               </div>

               <div className={styles.questionContainer}>
                  <li>
                     <Button sx={{marginBottom: 0, width: 260}} variant="contained" onClick={() => setQ2Visible(!q2Visible)}>
                        Start selling on Drawww!
                     </Button>
                  </li>
                  {question2}
               </div>
               
               <div className={styles.questionContainer}>
                  <li>
                     <Button sx={{marginBottom: 0, width: 260}} variant="contained" onClick={() => setQ5Visible(!q5Visible)}>
                        Why are there 3 W's? 
                     </Button>
                  </li>
                  {question5}
               </div>

            </ol>
         </div>
      </div>
   )
}
export default FaqScreen;