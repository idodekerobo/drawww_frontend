import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";

interface CountdownTimerProps {
   raffleExpirationDate: Timestamp
}

const CountdownTimer = ({ raffleExpirationDate }: CountdownTimerProps) => {
   const [ timeLeft, setTimeLeft ] = useState('');
   
   useEffect(() => {
      const countdown = setInterval(() => {
         const timeNow = new Date();
         const remaining = raffleExpirationDate.toMillis() - timeNow.getTime();
         const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
         const hours = Math.floor( (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
         const minutes = Math.floor( (remaining % (1000 * 60 * 60)) / (1000 * 60));
         const seconds = Math.floor( (remaining % (1000 * 60)) / 1000);
         setTimeLeft(`${days}D ${hours}H ${minutes}M ${seconds}S`)
      }, 1000);
      return () => {
         clearInterval(countdown);
      }
   }, [ setTimeLeft, raffleExpirationDate ]) // need to track when raffleExpirationDate changes because its init state has timestamp of now

   return (
      <>{timeLeft}</>
   )
}
export default CountdownTimer;