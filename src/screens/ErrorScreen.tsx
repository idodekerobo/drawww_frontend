import { Link } from "react-router-dom";

// api/utils
import { useWindowDimensions } from '../utils/hooks';
import { HOME } from '../constants';

// custom components
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

// styles
import styles from '../styles/ErrorScreen.module.css';

// material ui
import Container from '@mui/material/Container';

const ErrorScreen = () => {
   const { windowWidth } = useWindowDimensions();
   return (
      <>
         <NavigationBar />
         <Container sx={{ width: ((windowWidth > 399) ? '60%' : '100%') }} className={styles.containerWrapper} maxWidth="xl">
            <p className={styles.errorText}>
               Ahhh we messed up. Please go back to the homepage by clicking <Link className={styles.link} to={HOME}>here</Link>.
            </p>
         </Container>
         <div style={{marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </>
   )
}
export default ErrorScreen;