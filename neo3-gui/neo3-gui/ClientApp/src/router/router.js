import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from '../App';
import Sync from '../component/sync';
import Chain from '../pages/chain';

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Sync" component={Sync}/>
            <Route exact path="/Chain" component={Chain}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;