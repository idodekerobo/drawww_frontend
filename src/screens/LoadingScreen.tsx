// import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";
import { useWindowDimensions } from "../utils/hooks";

const LoadingScreen = () => {
   const { windowHeight, windowWidth } = useWindowDimensions();
   return (
      <div style={{ position: 'absolute',top: (windowHeight*.1), left: (windowWidth*.15) }}>
         <RingLoader speedMultiplier={0.45} color={"black"} loading={true} size={250} />
      </div>
   )
}
export default LoadingScreen;