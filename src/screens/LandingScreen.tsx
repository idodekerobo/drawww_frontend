// react
import React, { useState, useContext, useRef } from 'react';
// router
import { Redirect, useHistory } from "react-router-dom";
// api's/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { BACKEND_URL } from '../utils/api';
import { HOME } from '../constants';
// material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// styles
import styles from '../styles/LandingScreen.module.css'
import sneak from '../img/pix_sneak.png'

const LandingScreen = () => {
   const { loggedIn } = useContext(AuthContext);
   const history = useHistory();
   const [userEmail, setEmail] = useState('');
   const [ signedUp, setSignedUp ] = useState(false);
   const [ audioPlay, setAudioPlay ] = useState(false);
   const audioPlayerRef = useRef<HTMLAudioElement>(null);

   const onSkipClick = () => {
      history.push(HOME);
   }

   const onSignUpClick = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignedUp(true);
      console.log('pressed sign up')
      await fetch(`${BACKEND_URL}/addEmail`, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json',
         },
         body: JSON.stringify({
            emailAddress: userEmail
         }),
      });
      // history.push(HOME);
   }

   const controlAudio = () => {
      if (audioPlay) {
         if (audioPlayerRef.current !== null) {
            setAudioPlay(false)
            audioPlayerRef.current.pause()
         }
      } else {
         if (audioPlayerRef.current !== null) {
            setAudioPlay(true);
            audioPlayerRef.current.play()
         }
      }
   }

   if (loggedIn) {
      return <Redirect to={HOME} />
   }
   return (
      <div className={styles.container}>
         <div className={styles.audioPlayer} onClick={() => controlAudio()}>
               <>
                  {audioPlay ? 
                     <VolumeUpIcon />
                     :
                     <VolumeOffIcon />
                  }
                  <audio ref={audioPlayerRef}>
                     <source src={"https://firebasestorage.googleapis.com/v0/b/raffles-44479.appspot.com/o/music%2F1-09%20Send%20It%20Up.mp3?alt=media&token=283d746d-0281-4b13-a73c-97952f87d9bc"} type="audio/mpeg"/>
                  </audio>
               </>
            </div>
         {/* <div onClick={() => onSkipClick()} className={styles.skipButtonContainer}>
            X
         </div> */}

         { signedUp ? 
            <div>
               <p><span className={`${styles.emoji} ${styles.leftEmoji}`}>🤝</span>you'll hear from us soon<span className={styles.emoji}>🤝</span></p>
            </div>    
         :
            <>
               <div className={styles.imgContainer}>
                  <img alt="sneaker" className={`${styles.rotate} ${styles.linear} ${styles.infinite}`} src={sneak} />
               </div>

               <form className={styles.signUpForm} onSubmit={onSignUpClick}>
                  <p className={`${styles.infoText}`}>win draws, pay less</p>
                  <p className={`${styles.infoText}`}>host your own draws</p>
                  <p className={styles.text}>coming 1/1/22</p>
                  <div className={styles.iconContainer}>
                     <a className={styles.iconWrapperATag} href="https://www.instagram.com/drawww.xyz/">
                        <InstagramIcon className={styles.icon} />
                     </a>
                     <a className={styles.iconWrapperATag} href="https://twitter.com/drawwwxyz">
                        <TwitterIcon className={styles.icon} />
                     </a>
                  </div>
                  <TextField
                     sx={{ marginBottom: 1 }}
                     className={styles.emailInput}
                     required
                     type="email"
                     id="outlined-required"
                     label="email address"
                     placeholder="email address"
                     value={userEmail}
                     onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" className={styles.signUpButton} variant="contained">be the first to know about a new draw</Button>
               </form>
            </>
         }
      </div>
   )
}
export default LandingScreen;