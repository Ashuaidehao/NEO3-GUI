import React from "react";
import Router from './router/router';
import { ConfigProvider } from "antd";
import { Provider } from "mobx-react";
import stores from "./store/stores";

class App extends React.Component {
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
      var msg = JSON.parse(message.data);
      switch (msg.method) {
        case "getSyncHeight":
          stores.blockSyncStore.setHeight(msg.result);
          break;
        case "getWalletBalance":
          stores.walletAddressStore.setAccounts(msg.result);
          break;
        default:
          break;
      }
      // var myEvent = new CustomEvent('wsMessage', {
      //     detail: JSON.parse(message.data),
      // });
      // window.dispatchEvent(myEvent);
    };
  }

  render() {
    return (
      <Provider {...stores}>
        <ConfigProvider>
          <Router></Router>
        </ConfigProvider>
      </Provider>
    );
  }
}

export default App;
