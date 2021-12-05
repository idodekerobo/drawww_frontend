// react
import { useState, useEffect } from 'react';

// components
import NavigationBar from '../components/NavigationBar';
import SplashBar from '../components/SplashBar';
import RaffleCard from '../components/RaffleCard';

// context/api/utils
import { grabRafflesFromFirestore } from '../utils/api';
import { IRaffleDataFromFirestoreType } from '../utils/types';

// css styling
import styles from '../styles/HomeScreen.module.css';

// material ui
import Container from '@mui/material/Container';

const HomeScreen = () => {
   const [ raffleData, setRaffleData ] = useState<IRaffleDataFromFirestoreType[]>([])

   const getRaffleDataFunc = async () => {
      const getRaffleData = await grabRafflesFromFirestore();
      setRaffleData(getRaffleData);
   }

   useEffect(() => {
      getRaffleDataFunc();
   }, [ ])

   return (
      <div className={styles.allComponentWrapper}>
         <NavigationBar />
         <SplashBar />
         <Container className={styles.containerWrapper} maxWidth="xl">
            {raffleData.map((raffle) =>  <RaffleCard raffle={raffle} key={raffle.id} />) }
         </Container>
      </div>
   )
}
export default HomeScreen;