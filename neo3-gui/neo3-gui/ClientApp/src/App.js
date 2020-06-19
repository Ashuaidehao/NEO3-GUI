import React from "react";
import Router from './router/router';
import { ConfigProvider } from "antd";
import { Provider } from "mobx-react";
import stores from "./store/stores";
import Config from "./config";
import neoNode from "./neonode";
import neoWebSocket from "./components/WebSocket/neoWebSocket";


class App extends React.Component {
  constructor(props) {
    super(props);

    console.log(window.location.href);
    if (process.env.NODE_ENV !== "development") {
      neoNode.switchNode();
    }

    neoWebSocket.initWebSocket();
    neoWebSocket.registMethod("getSyncHeight", this.processGetSyncHeight);
    neoWebSocket.registMethod("getWalletBalance", this.processGetWalletBalance);
  }


  componentWillUnmount = () => {
    neoWebSocket.unregistMethod("getSyncHeight", this.processGetSyncHeight);
    neoWebSocket.unregistMethod("getWalletBalance", this.processGetWalletBalance);
  }

  processGetSyncHeight(msg) {
    stores.blockSyncStore.setHeight(msg.result);
  }


  processGetWalletBalance(msg) {
    stores.walletStore.setAccounts(msg.result.accounts);
    stores.walletStore.setUnclaimedGas(msg.result.unclaimedGas);
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
