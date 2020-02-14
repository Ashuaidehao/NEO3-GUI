/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Button, Input } from 'antd';

const {dialog} = window.remote;

class Walletprivate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        showElem: false,
        path:''
    };
  }
  changeTab(e){
    this.setState(prevState => ({
      showElem: !prevState.showElem
    }));
  }
  veriPrivate = () => {
    var _this = this.state;
    var pass = document.getElementById("privateKey").value;
    console.log(pass);
    axios.post('http://localhost:8081', {
      "id":"20",
      "method": "ImportWif",
      "params":["L3H8iw9nmcHuvRX2xs5c95EP6bQotHZpYNuz7K4UkBzTK7tx3eXQ",
      "L3Abqzw7vqBBzbcJz1Yo5SERpbefLNAo9dN94hxXkVxAFYCQJRyQ"]
    })
    .then(function (res) {
      let _data = res.data;
      console.log(_data);
      if(_data.msgType == 3){
        message.success("私钥打开成功",2);
      }else{
        message.info("私钥输入错误",2);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    return (
      <div>
          <div>
              <img></img>
              <Input id="privateKey" placeholder="导入私钥" />
              {!this.state.showElem?(
                <Button onClick={this.veriPrivate}>私钥验证</Button>
              ):null}
              {this.state.showElem?(
                <div>
                    <Input.Password id="password" placeholder="input password" maxLength="50" onChange={this.checkinput} onPressEnter={this.openWallet}/>
                    <Button onClick={this.createWallet}>创建钱包</Button>
                </div>
              ):null}
          </div>
      </div>
    );
  }
  getpath = () =>{


  }
} 

export default Walletprivate;