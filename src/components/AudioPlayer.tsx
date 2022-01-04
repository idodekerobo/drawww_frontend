import { useState, useRef, useEffect } from 'react';
import styles from '../styles/AudioPlayer.module.css'
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface AudioPlayerProps {
   path?: string,
}
const AudioPlayer = ({ path }: AudioPlayerProps) => {
   const [ audioPlay, setAudioPlay ] = useState(false);
   const [ position, setPosition ] = useState('top');
   const audioPlayerRef = useRef<HTMLAudioElement>(null);

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
   useEffect(() => {
      const changePosition = () => {
         if (path === '/') {
            setPosition('top');
         } else {
            setPosition('bottom');
         }
      }
      changePosition();
   }, [ path, setPosition ])
   return (
      <div className={`${styles.audioPlayer} ${(position === 'top') ? styles.topPosition : styles.bottomPosition}`} onClick={() => controlAudio()}>
            <>
               {audioPlay ? 
                  <VolumeUpIcon />
                  :
                  <VolumeOffIcon />
               }
               <audio ref={audioPlayerRef}>
                  <source src={"https://firebasestorage.googleapis.com/v0/b/raffles-44479.appspot.com/o/music%2FLarry_June_Cardo_-_Green_Juice_In_Dallas_Intro__360media.com.ng.mp3?alt=media&token=fd3ce04c-d4de-42a5-b2bd-8ff3e0f92cfe"} type="audio/mpeg"/>
               </audio>
            </>
         </div>
   )
}
export default AudioPlayer;