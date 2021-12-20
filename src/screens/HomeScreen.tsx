// react
import { useState, useEffect } from 'react';

// components
import NavigationBar from '../components/NavigationBar';
import SplashBar from '../components/SplashBar';
import DrawCard from '../components/DrawCard';

// context/api/utils
import { grabRafflesFromFirestore } from '../utils/api';
import { IDrawDataFromFirestoreType } from '../utils/types';

// css styling
import styles from '../styles/HomeScreen.module.css';

// material ui
import Container from '@mui/material/Container';

const HomeScreen = () => {
   const [ drawData, setDrawData ] = useState<IDrawDataFromFirestoreType[]>([])

   const getDrawDataFunc = async () => {
      const getDrawData = await grabRafflesFromFirestore();
      setDrawData(getDrawData);
   }

   useEffect(() => {
      // getDrawDataFunc();
   }, [ ])

   return (
      <div className={styles.allComponentWrapper}>
         <NavigationBar />
         <SplashBar />
         <Container className={styles.containerWrapper} maxWidth="xl">
            {drawData.map((draw) =>  <DrawCard draw={draw} key={draw.id} />) }
            {(drawData.length == 0) ?
               <div className={styles.center}>
                  <p className={styles.font}>
                     New draw's will be coming soon
                  </p>
               </div>
            :
               null
            }
         </Container>
      </div>
   )
}
export default HomeScreen;