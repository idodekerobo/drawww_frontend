import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import styles from '../styles/SplashBar.module.css'

interface SplashBarProps {
   splashBarText: string,
   thankYou?: boolean
}
const SplashBar = ({ splashBarText, thankYou }: SplashBarProps) => {
   return (
      <>
         <Box className={(!thankYou) ? styles.boxStyling : styles.thankYouBoxStyling }>
            <Typography variant="h6" component="div" >
               {splashBarText}
            </Typography>
         </Box>
      </>
   )
}
export default SplashBar;