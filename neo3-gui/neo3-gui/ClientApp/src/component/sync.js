
import React from 'react';
import { Icon , Typography } from 'antd';
import 'antd/dist/antd.css';

const { Text } = Typography;



class Sync extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height:0,
      syncHeight:0
    };
  }
  UNSAFE_componentWillMount(){
    this.getConnect();
  }
  getConnect(){
    let _this = this;
    var ws = new WebSocket("ws://localhost:8081");
    ws.onopen = function() {
        console.log("this open");
        
        console.log(this);
        
        console.log(_this);
    };
    
    ws.onmessage = function(e) {
        let data = JSON.parse(e.data).result;

        _this.getSyncheight(data.syncHeight);
        _this.getHeight(data.headerHeight);
    }
    
    ws.onclose = function(e) {
        console.log("closed");
    }
    
    ws.onerror = function(e) {
        console.log("error" + e);
    }
  }
  getSyncheight(num){
    this.setState({
      syncHeight: num
    })
  }
  getHeight(num){
    this.setState({
      height: num
    })
  }
  render(){
    return (
      <div>
        <p>
          <Icon type="info-circle" theme="twoTone" twoToneColor="#52c41a" />
          <Text type="secondary"> 版本 v3.0.1</Text>
        </p>
        <p>
          <Icon type="sync" /> 
          <Text type="secondary"> {this.state.syncHeight} / {this.state.height} </Text>
          <Text>区块同步中</Text>
        </p>
      </div>
    );
  }
} 

export default Sync;