import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import styles from '../styles/SplashBar.module.css'

const SplashBar = () => {
   return (
      <>
         <Box className={styles.boxStyling}>
            <Typography variant="h6" component="div" >
               Available Raffles
            </Typography>
         </Box>
      </>
   )
}
export default SplashBar;