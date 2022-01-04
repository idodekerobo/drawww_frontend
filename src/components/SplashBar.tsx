import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import styles from '../styles/SplashBar.module.css'

interface SplashBarProps {
   splashBarText: string
}
const SplashBar = ({ splashBarText }: SplashBarProps) => {
   return (
      <>
         <Box className={styles.boxStyling}>
            <Typography variant="h6" component="div" >
               {splashBarText}
            </Typography>
         </Box>
      </>
   )
}
export default SplashBar;