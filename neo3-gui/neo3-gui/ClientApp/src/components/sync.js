
import React from 'react';
import { Icon, Typography } from 'antd';
import 'antd/dist/antd.css';
import WsMessageComponent from './Websocket/WsMessageComponent';

const { Text } = Typography;

class Sync extends WsMessageComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      syncHeight: 0
    };

    this.register((wsMessage) => this.setState({
      height: wsMessage.result.headerHeight,
      syncHeight: wsMessage.result.syncHeight
    }));
  }
  // UNSAFE_componentWillMount(){
  //   this.getConnect();
  //   console.log("Sync connnecting!");

  // }

  // getConnect(){
  //   let _this = this;
  //   var ws = new WebSocket("ws://localhost:8081");
  //   ws.onopen = function() {
  //       console.log("this open");
  //   };

  //   ws.onmessage = function(e) {
  //       let data = JSON.parse(e.data).result;
  //       console.log(data);
  //       _this.getSyncheight(data.syncHeight);
  //       _this.getHeight(data.headerHeight);
  //   }

  //   ws.onclose = function(e) {
  //       console.log(e);
  //       console.log("closed");
  //   }

  //   ws.onerror = function(e) {
  //       console.log("error" + e);
  //   }
  // }
  // getSyncheight(num){
  //   this.setState({
  //     syncHeight: num
  //   })
  // }
  // getHeight(num){
  //   this.setState({
  //     height: num
  //   })
  // }
  render() {
    return (
      <div>
        <p className="ml3 mb0">
          <Text className="t-normal bold"> {this.state.syncHeight} / {this.state.height} 区块同步中</Text>
          <Icon className="ml3" type="sync" spin/> 
        </p>
      </div>
    );
  }
}

export default Sync;