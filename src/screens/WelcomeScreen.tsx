// custom components
import UpdateProfileInfoForm from '../components/UpdateProfileInfoForm';

// styles
import styles from '../styles/WelcomeScreen.module.css'

// material ui
import Container from '@mui/material/Container';

// nav bar imports
import NavigationBar from '../components/NavigationBar';

const WelcomeScreen = () => {

   return (
      <div>
         <NavigationBar />
         <Container className={styles.containerWrapper} maxWidth="xl">
            <h3>Thank you for signing up!</h3>
            <h3>
               Please fill out the below!
            </h3>

            <UpdateProfileInfoForm />

         </Container>

      </div>
   )
}
export default WelcomeScreen;