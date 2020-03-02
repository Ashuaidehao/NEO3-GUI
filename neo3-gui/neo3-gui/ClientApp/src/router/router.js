import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from '../App';
import Sync from '../components/sync';
import Chain from '../pages/chain';
import Advanced from '../pages/advanced';
import Wallet from '../components/Wallet/wallet';
import Walletlist from '../components/Wallet/walletlist';

const BasicRoute = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Sync" component={Sync}/>
            <Route exact path="/Chain" component={Chain}/>
            <Route exact path="/Advanced" component={Advanced}/>
            <Route exact path="/Chain" component={Chain}/>
            <Route exact path="/Wallet" component={Wallet}/>
            <Route exact path="/Walletlist" component={Walletlist}/>
        </Switch>
    </BrowserRouter>
);

export default BasicRoute;