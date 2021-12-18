// npm
import { Link } from "react-router-dom";

// context/api/utils
import { DRAW } from '../constants';
import { IDrawCardProps } from '../utils/types';
import { useWindowDimensions } from "../utils/hooks";

// styling
import styles from '../styles/DrawCard.module.css';

// material ui
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const DrawCard = ({ draw }: IDrawCardProps) => {
   const { windowWidth } = useWindowDimensions();

   const expireDate = draw.raffleExpirationDate.toDate();
   return (
      <Link className={styles.wrapper} to={`${DRAW}/${draw.id}`}>
         <Card className={styles.cardStyles} sx={{ width: ((windowWidth < 400) ? 140 : 220), height: 300, borderRadius: 0 }}>
            <CardActionArea>
               <CardMedia
                  component="img"
                  sx={{ height: 140, }}
                  src={draw.raffleImageDownloadUrls[0]}
                  alt="raffle photo"
               />
               <CardContent sx={{bgcolor: '#fff', opacity: 1}}>
                  <Typography gutterBottom variant="button" component="div" sx={{fontWeight: 700, margin: 0}}>
                     {draw.raffleSneakerBrand}
                  </Typography>
                  <Typography gutterBottom variant="button" component="div" sx={{fontWeight: 700, whiteSpace: 'nowrap' }}>
                     {draw.raffleSneakerName}
                  </Typography>
                  <Typography variant="body1" className={styles.boldedFont}>
                     ${draw.pricePerRaffleTicket}
                  </Typography>
                  <Typography variant="body2">
                     Closing: <span className={styles.boldedFont}>{`${expireDate.getMonth() + 1}/${expireDate.getDate()}/${expireDate.getFullYear()}`}</span>
                  </Typography>
                  <Typography variant="body2">
                     {draw.numRemainingRaffleTickets} tickets left
                  </Typography>
               </CardContent>
            </CardActionArea>
         </Card>
      </Link>
   )
}
export default DrawCard;