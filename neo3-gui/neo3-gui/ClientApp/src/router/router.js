import React from 'react';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';
import Home from '../App';
import Sync from '../components/sync';

import Chain from '../components/Chain/chain';
import Chainlayout from '../components/Chain/chainlayout';

import Advanced from '../pages/advanced';

import Wallet from '../components/Wallet/wallet';
import Walletlayout from '../components/Wallet/walletlayout';
import Walletlist from '../components/Wallet/walletlist';
import Walletdetail from '../components/Wallet/walletdetail';
import Wallettrans from '../components/Wallet/trans';

import Transfer from '../components/Transaction/transfer';

import { Layout } from 'antd';

const BasicRoute = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/sync" component={Sync}/>
            <Route exact path="/advanced" component={Advanced}/>
            <Route path="/chain">
                <Layout style={{ height: 'calc( 100vh )'}}>
                    <Route component={Chainlayout} />
                    <Route exact path="/chain" component={Chain} />
                </Layout>
            </Route>
            <Route path="/wallet">
                <Layout style={{ height: 'calc( 100vh )'}}>
                    <Route component={Walletlayout} />
                    <Route exact path="/wallet" component={Wallet} />
                    <Route exact path="/wallet/walletlist" component={Walletlist} />
                    <Route exact path="/wallet/walletlist:address" component={Walletdetail} />
                    <Route exact path="/wallet/trans" component={Wallettrans} />
                    <Route exact path="/wallet/transfer" component={Transfer} />
                </Layout>
            </Route>
            <Redirect from="*" to="/home" />
        </Switch>
    </BrowserRouter>
);

export default BasicRoute;