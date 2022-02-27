import { Link } from "react-router-dom";

// custom components
import SplashBar from '../components/SplashBar';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { HOME } from '../constants';

// styles
import styles from '../styles/ThankYouScreen.module.css'

// material ui
import Container from '@mui/material/Container';

const ThankYouScreen = () => {

   return (
      <div>
         <NavigationBar />
         <SplashBar splashBarText="🤝" />
         <Container className={styles.containerWrapper} maxWidth="xl">
            <h3 className={styles.thankYouText}>Thank you for purchasing!</h3>
            <p className={styles.infoText}>
               You'll get a follow up email with your ticket number(s) shortly.
            </p>
            <p>
               <Link className={styles.link} to={HOME}>Home</Link>
            </p>
         </Container>
         <div style={{marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>

      </div>
   )
}
export default ThankYouScreen;