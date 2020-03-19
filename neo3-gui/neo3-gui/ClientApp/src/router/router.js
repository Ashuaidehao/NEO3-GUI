import React from 'react';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';
import Home from '../pages/home'
import Sync from '../components/sync';

import Chain from '../components/Chain/chain';
import Chainlayout from '../components/Chain/chainlayout';
import Blockdetail from '../components/Chain/blockdetail';
import Blockhashdetail from '../components/Chain/hashdetail';
import Chaintrans from '../components/Chain/trans';
import Chainasset from '../components/Chain/asset';

import Advanced from '../components/Advanced/advanced';

import Wallet from '../components/Wallet/wallet';
import Walletlayout from '../components/Wallet/walletlayout';
import Walletlist from '../components/Wallet/walletlist';
import Walletdetail from '../components/Wallet/walletdetail';
import Wallettrans from '../components/Wallet/trans';

import Transfer from '../components/Transaction/transfer';
import Transcon from '../components/Transaction/transcon';

import Consensus from '../components/Consensus/consensus';
import Consensuslayout from '../components/Consensus/consensuslayout';
import Consensusdeploy from '../components/Consensus/deploy';

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
                    <Route exact path="/chain/detail:height" component={Blockdetail} />
                    <Route exact path="/chain/hashdetail:height" component={Blockhashdetail} />
                    <Route exact path="/chain/transaction" component={Chaintrans} />
                    <Route exact path="/chain/transaction:hash" component={Transcon} />
                    <Route exact path="/chain/asset" component={Chainasset} />
                    <Route exact path="/chain/asset:hash" component={Chainasset} />
                    <Route exact path="/chain/address:address" component={Walletdetail} />
                </Layout>
            </Route>
            <Route path="/wallet">
                <Layout style={{ height: 'calc( 100vh )'}}>
                    <Route component={Walletlayout} />
                    <Route exact path="/wallet" component={Wallet} />
                    <Route exact path="/wallet/walletlist" component={Walletlist} />
                    <Route exact path="/wallet/walletlist:address" component={Walletdetail} />
                    <Route exact path="/wallet/address:address" component={Walletdetail} />
                    <Route exact path="/wallet/transaction" component={Wallettrans} />
                    <Route exact path="/wallet/transaction:hash" component={Transcon} />
                    <Route exact path="/wallet/transfer" component={Transfer} />
                </Layout>
            </Route>
            <Route path="/consensus">
                <Layout style={{ height: 'calc( 100vh )'}}>
                    <Route component={Consensuslayout} />
                    <Route exact path="/consensus" component={Consensus} />
                    <Route exact path="/consensus/deploy" component={Consensusdeploy} />
                </Layout>
            </Route>
            <Redirect from="*" to="/" />
        </Switch>
    </BrowserRouter>
);

export default BasicRoute;