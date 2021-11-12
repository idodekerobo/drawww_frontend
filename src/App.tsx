import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AccountScreen from './screens/AccountScreen';
import AddRaffleScreen from './screens/AddRaffleScreen';


import { Switch, Route } from "react-router-dom";

import { HOME, LOGIN, SIGN_UP, WELCOME, ACCOUNT, ADD_RAFFLE } from './constants'


function App() {
   return (
      <Switch>
         
         <Route path={LOGIN}>
            <LoginScreen />
         </Route>

         <Route path={SIGN_UP}>
            <SignUpScreen />
         </Route>

         <Route path={WELCOME}>
            <WelcomeScreen />
         </Route>

         <Route path={ACCOUNT}>
            <AccountScreen />
         </Route>

         <Route path={ADD_RAFFLE}>
            <AddRaffleScreen />
         </Route>

         <Route exact path={HOME}>
            <HomeScreen />
         </Route>
      
      </Switch>
   );
}

export default App;
