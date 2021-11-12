// react
import { useContext } from 'react';

// context
import { AuthContext } from '../context/AuthContext/AuthContext';

// nav bar
import NavigationBar from '../components/NavigationBar';

// material ui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const HomeScreen = () => {

   const { loggedIn } = useContext(AuthContext);

   return (
      <div>
         <NavigationBar />

         <Container maxWidth="xl">
            <h3>{loggedIn ? 'someone is logged in! :)' : 'no one is logged in! :('}</h3>
            <h3>Available Raffles</h3>
            <Card sx={{ maxWidth: 345 }}>
               <CardActionArea>
                  <CardMedia
                     component="img"
                     height="140"
                     src="https://cdn.shopify.com/s/files/1/0094/2252/files/18_8c636bd6-5f65-418f-95e9-aef1c755ec04.jpg?v=1606259979"
                     alt="sneaker raffle"
                  />
                  <CardContent>
                     <Typography gutterBottom variant="h5" component="div">
                        Asics Raffle
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Sneaker raffle by xyz. Price per ticket: $25. Tickets remaining: ???
                     </Typography>
                  </CardContent>
               </CardActionArea>
            </Card>
         </Container>
      </div>
   )
}
export default HomeScreen;