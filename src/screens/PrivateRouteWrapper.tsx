import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { Route, Redirect } from "react-router-dom";
import { LOGIN } from '../constants';

const PrivateRouteWrapper = ({ children, ...rest}: any) => {
   const { user, loading } = useContext(AuthContext);
   return (
      <Route {...rest} 
         render={ ({ location }) => {
            if (loading) {
               return ( <div>loading...</div> )
            }
            return user ? (
               children
            ) : (
               <Redirect to={LOGIN} />
            );
         }}
      />
   );
}
export default PrivateRouteWrapper;