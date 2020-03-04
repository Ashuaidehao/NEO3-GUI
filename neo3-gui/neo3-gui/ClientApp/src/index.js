import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router/router';
import { ConfigProvider } from 'antd';
import * as serviceWorker from './serviceWorker';


class WsIndex extends Component {
    constructor(props) {
        super(props);
        this.ws = new WebSocket('ws://127.0.0.1:8081');

        this.ws.onopen = () => {
            console.log('opened');
        };

        this.ws.onclose = function (e) {
            console.log(e);
            console.log("closed");
        }

        this.ws.onerror = function (e) {
            console.log("error" + e);
        }

        this.ws.onmessage = (message) => {
            var myEvent = new CustomEvent('wsMessage', {
                detail: JSON.parse(message.data),
            });
            window.dispatchEvent(myEvent);
        };
    }

    componentWillUnmount() {
        this.ws.close();
    }

    render() {
        return <ConfigProvider>
            <Router />
        </ConfigProvider>;
    }
}
ReactDOM.render(
    <WsIndex>
    </WsIndex>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
