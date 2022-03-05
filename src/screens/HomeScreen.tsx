// react
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";

// components
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SplashBar from '../components/SplashBar';
import DrawCard from '../components/DrawCard';

// context/api/utils
import { grabRafflesFromFirestore } from '../utils/api';
import { IDrawDataFromFirestoreType } from '../utils/types';

// css styling
import styles from '../styles/HomeScreen.module.css';

// material ui
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

const HomeScreen = () => {
   const [ loading, setLoading ] = useState<boolean>(true);
   const [ drawData, setDrawData ] = useState<IDrawDataFromFirestoreType[]>([])

   const getDrawDataFunc = async () => {
      const getDrawData = await grabRafflesFromFirestore();
      setDrawData(getDrawData);
      setLoading(false);
   }

   const draws = <>{(loading) ? 
      <p style={{textAlign: 'center'}}><CircularProgress sx={{margin: 0}}/></p>
      :
      (drawData.length === 0) ?
            <div className={styles.center}>
               <p className={styles.font}>
                  New draw's will be coming soon
               </p>
            </div>
         :
            drawData.map((draw) =>  <DrawCard draw={draw} key={draw.id} />)
   }</>

   useEffect(() => {
      getDrawDataFunc();
   }, [ ])

   return (
      <div className={styles.allComponentWrapper}>
         <Helmet>
            <title> drawww | buying and selling sneaker raffles</title>
            <meta name="description" content="Raffle and draw tickets for Jordan's, Dunks, New Balances, Yeezy's and more" />
            <link rel="canonical" href={window.location.href} />
         </Helmet>
         <NavigationBar />
         <SplashBar splashBarText='Available Draws'/>
         <Container className={styles.containerWrapper} maxWidth="xl">
            {draws}
         </Container>
         <div style={{marginTop: 100, marginBottom: 100 }}>
            <Footer />
         </div>
      </div>
   )
}
export default HomeScreen;