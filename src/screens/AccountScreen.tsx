// npm
import { useContext } from 'react';
import { Redirect } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { LOGIN } from '../constants';

// custom components
import NavigationBar from "../components/NavigationBar";

const AccountScreen = () => {

   const { loggedIn } = useContext(AuthContext);

   if (!loggedIn) {
      return <Redirect to={LOGIN} />
   }

   return (
      <div>
         <NavigationBar />
         <p>hey hey hey</p>
      </div>
   )
}
export default AccountScreen;