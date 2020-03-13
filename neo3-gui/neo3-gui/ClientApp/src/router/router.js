import React from 'react';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';
import Home from '../pages/home'
import Sync from '../components/sync';

import Chain from '../components/Chain/chain';
import Chainlayout from '../components/Chain/chainlayout';
import Blockdetail from '../components/Chain/blockdetail';
import Chaintrans from '../components/Chain/trans';
import Chainasset from '../components/Chain/asset';

import Advanced from '../pages/advanced';

import Wallet from '../components/Wallet/wallet';
import Walletlayout from '../components/Wallet/walletlayout';
import Walletlist from '../components/Wallet/walletlist';
import Walletdetail from '../components/Wallet/walletdetail';
import Wallettrans from '../components/Wallet/trans';

import Transfer from '../components/Transaction/transfer';
import Transdetail from '../components/Transaction/transdetail';

import Consensus from '../components/Consensus/consensus';
import Consensuslayout from '../components/Consensus/consensuslayout';

import { Layout } from 'antd';
// import Transaction from '../components/Transaction/transaction';


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
                    <Route exact path="/chain/detail:height" component={Blockdetail} />
                    <Route exact path="/chain/transaction" component={Chaintrans} />
                    <Route exact path="/chain/transaction:hash" component={Chain} />
                    <Route exact path="/chain/asset" component={Chainasset} />
                    <Route exact path="/chain/asset:hash" component={Chainasset} />
                </Layout>
            </Route>
            <Route path="/wallet">
                <Layout style={{ height: 'calc( 100vh )'}}>
                    <Route component={Walletlayout} />
                    <Route exact path="/wallet" component={Wallet} />
                    <Route exact path="/wallet/walletlist" component={Walletlist} />
                    <Route exact path="/wallet/walletlist:address" component={Walletdetail} />
                    <Route exact path="/wallet/transaction" component={Wallettrans} />
                    <Route exact path="/wallet/transaction:hash" component={Transdetail} />
                    <Route exact path="/wallet/transfer" component={Transfer} />
                </Layout>
            </Route>
            <Route path="/consensus">
                <Layout style={{ height: 'calc( 100vh )'}}>
                    <Route component={Consensuslayout} />
                    <Route exact path="/consensus" component={Consensus} />
                </Layout>
            </Route>
            <Redirect from="*" to="/" />
        </Switch>
    </BrowserRouter>
);

export default BasicRoute;