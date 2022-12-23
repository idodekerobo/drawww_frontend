import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext/AuthContext';
import { Route, Navigate, redirect } from "react-router-dom";
import { LOGIN } from '../constants';

const AuthRequiredRoute = ({ children, redirectTo }: any) => {
   const { user } = useContext(AuthContext);
   return user ? children : <Navigate to={redirectTo} /> ;
}

// const PrivateRouteWrapper = ({ children, ...rest}: any) => {
//    const { user, loading } = useContext(AuthContext);
//    return (
//       <Route {...rest} 
//          render={ () => {
//             if (loading) {
//                return ( <div>loading...</div> )
//             }
//             return user ? (
//                children
//             ) : (
//                <Navigate to={LOGIN} />
//             );
//          }}
//       />
//    );
// }
export default AuthRequiredRoute;