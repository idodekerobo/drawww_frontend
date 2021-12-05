// npm
import { useContext } from 'react';
import { Redirect, useParams } from "react-router-dom";

// api/utils
import { AuthContext } from '../context/AuthContext/AuthContext';
import { IAccountUrlParams } from '../utils/types';
import { LOGIN } from '../constants';
import { TEST_BACKEND_URL } from '../utils/api';

// custom components
import NavigationBar from "../components/NavigationBar";

// material ui
import Button from '@mui/material/Button';

const AccountScreen = () => {

   let params: IAccountUrlParams = useParams();
   const { loggedIn } = useContext(AuthContext);

   if (!loggedIn) {
      return <Redirect to={LOGIN} />
   }

   // TODO - give user feedback that they are being redirected
   return (
      <div>
         <NavigationBar />
         <p>hey hey hey</p>
         <a href={`${TEST_BACKEND_URL}/connect_seller/${params.accountId}`} >
            <Button variant="contained">Add Bank Account Info</Button>
         </a>
      </div>
   )
}
export default AccountScreen;