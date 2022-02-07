// react
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// components
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import SplashBar from '../components/SplashBar';

// context/api/utils
import { EMAIL_LIST_PAGE } from '../constants'

// css styling
import styles from '../styles/BlogScreen.module.css';

// material ui
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const BlogScreen = () => {

   useEffect(() => {
      document.title = "How To Cop Union LA Nike Low Dunks | Drawww"
   })

   return (
      <div className={styles.allComponentWrapper}>
         <Helmet>
            <title>How To Cop Union LA Nike Low Dunks | Drawww</title>
            <meta name="description" content="Union LA Nike Dunk Low Passport Pack Pistachio Release Info" />
            <link rel="canonical" href="https://www.drawww.xyz/blog" />
         </Helmet>
         <NavigationBar />
         <SplashBar splashBarText='Blog' />

         <div className={styles.articleContainer}>
            <Typography sx={{ fontSize: 38, fontWeight: 500, marginBottom: 3 }} variant="h1">How To Cop The Union LA "Pistachio" Nike Low Dunks</Typography>

            <div className={styles.mediaContainer}>
               <Card sx={{ maxWidth: 620 }}>
                  <CardMedia
                     component="img"
                     sx={{ maxWidth: 600 }}
                     src="https://sneakernews.com/wp-content/uploads/2021/12/Union-Nike-Dunk-Low-Green-00.jpg"
                     alt="Union LA Pistachio Nike Dunks"
                  />
               </Card>
            </div>

            <Typography sx={{ fontSize: 24, fontWeight: 400 }} variant="h2">Union LA Passport Pack</Typography>

            <div className={styles.articleBody}>
               <div className={styles.keyInfoContainer}>
                  <a href="https://store.unionlosangeles.com/pages/passport-pack">
                     <h4 className={styles.h4Heading}>Release Info</h4>
                     <p><span className={styles.boldedText}>Sneaker: </span>Union LA X Nike Dunk Low Passport Pack "Pistachio"</p>
                     <p><span className={styles.boldedText}>Release Date: </span>10am (PDT), February 11, 2022</p>
                     <p><span className={styles.boldedText}>Location: </span>Union LA Store</p>
                     <p><span className={styles.boldedText}>Method: </span>In-store raffle entry on Saturday (2/05) and Sunday (2/06) from 9am-3pm (PDT) both days.</p>
                  </a>
               </div>

               <div className={styles.ctaContainer}>
                  <p>
                     Drawww is a platform where you can buy raffle tickets for all types of sneaker heat.
                     <br />
                     <br />
                     Join our email list to be notified when new shoes are available to buy!
                  </p>
                  <Link to={EMAIL_LIST_PAGE}>
                     <Button className={styles.emailListButton} sx={{ marginBottom: 3, fontSize: 18, width: '70%' }} variant="contained">Sign Up!</Button>
                  </Link>
               </div>


               <div className={styles.articleText}>
                  <p>
                     The "Pistachio" colorway of the Union LA <a href="https://store.unionlosangeles.com/pages/passport-pack">Passport Pack</a> will be Union exclusives.

                     <br />
                     <br />
                     The remaining two colorways of the Passport Pack is scheduled to release in March and it is not confirmed if they'll be released online or in-store only.
                  </p>

                  <h4 className={styles.h4Heading}>Brief History of Union LA</h4>
                  <p>
                     <a href="https://store.unionlosangeles.com/">Union LA</a> has not missed with any of their recent collabs. The "Pistachio" Nike Dunk Low follows collabs with Jordan and Nike that produced pairs of Jordan 4's, 2's, and Dunks.

                     The LA based boutique, founded by Eddie Cruz and two others and now owned/operated by Chris Gibbs, has history dating back to NYC in 1989. Union originally opened in Soho on Spring Street it aimed to showcase New York's youth and counter culture.
                     <br />
                     <br />
                     The Los Angeles shop opened soon after and maintained the same principles while embracing the wave coming from LA.
                     <br />
                     You can buy clothes direct from their online store or visit the boutique in person on La Brea Ave in Los Angeles. Union also has flagship stores in New York City and Tokyo.
                  </p>
               </div>
            </div>
         </div>
         <div style={{ marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </div>
   )
}
export default BlogScreen;