/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input, Button, message } from 'antd';

class Walletopen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      iconLoading:false,
      path:'',
    };
  }
  setpath = () =>{
    var file = document.getElementById("file").files[0];
    // var _path = file?(file.path).replace(/\\/g,"\\\\"):"";
    var _path = file.path;
    if(file){
      this.setState({path :_path})
    }else{
      message.info("钱包选择失败，请选择正确的文件格式",2);
    }
  }
  verifi = () => {
    var path = this.state.path;
    var pass = document.getElementById("opass").value;
    if(!path||!pass){
      message.error("请选择文件及输入密码",3);
      return;
    }
    this.setState({ iconLoading: true });
    this.openWallet();
  }
  openWallet = () => {
    var _this = this;
    var pass = document.getElementById("opass").value;
    var ss = {
      "id" : "1",
      "method" : "OpenWallet",
      "params" : {
        "path" : _this.state.path,
        // "password" : pass
        "password" : "123456"
      }
    };
    console.log(ss);
    axios.post('http://localhost:8081', {
      "id" : "1",
      "method" : "OpenWallet",
      "params" : {
        "path" : _this.state.path,
        // "password" : pass
        "password" : "123456"
      }
    })
    .then(function (res) {
      let _data = res.data;
      _this.setState({ iconLoading: false });
      if(_data.msgType == 3){
        message.success("钱包文件已打开",2);
        //添加跳转
      }else{
        message.info("钱包文件或密码错误，请检查后重试",2);
      }
      
    })
   .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render(){
    return (
      <div>
        <img></img>
        <input type="file" id="file" onChange={this.setpath} />
        <Input.Password id="opass" placeholder="input password" maxLength="50" onChange={this.checkinput} onPressEnter={this.openWallet}/>
        <Button onClick={this.verifi} loading={this.state.iconLoading}>确认</Button>
        <Button onClick={this.savedialog}>savedialog</Button>
      </div>
    );
  }
  openWallet2 = () => {
    var path = this.state.path;
    var _this = this;
    console.log(path);
    console.log(file.path);
    var pass = document.getElementById("password").value;
    if(!path||!pass){
      message.error("请确认文件及密码",3);
      return;
    }
    this.setState({ iconLoading: true });
    // var ws = new WebSocket("ws://localhost:8081");
    // let da = {
    //   "id":"1234",
    //   "method": "OpenWallet",
    //   "params": {
    //     "path": path,
    //     "password": "123456"
    //   }
    // };
    // // let da = {
    // //   "id":"1234",
    // //   "method": "OpenWallet",
    // //   "params": {
    // //     "path": path,
    // //     "password": pass
    // //   }
    // // };
    // ws.onopen = function() {
      
    //   ws.send(JSON.stringify(da));
      
    //   console.log("数据发送中...");
    // };
    
    // ws.onmessage = function(e) {
    //     let data = JSON.parse(e.data);
    //     console.log(data)
    //     if(data.msgType == 3){
    //       _this.setState({ iconLoading: false });
    //       message.success("钱包文件已选择",2);
    //     }else{
    //       message.info("钱包文件或密码错误，请检查后重试",2);
    //     }
    // }
    
    // ws.onclose = function(e) {
    //     console.log(e);
    //     message.info("网络连接失败，请稍后再试",3);
    // }
    
    // ws.onerror = function(e) {
    //     console.log(e);
    //     message.info("error" + e);
    // }
  }
} 

export default Walletopen;
