/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Button, Input } from 'antd';

import CheckPass from '../Common/checkpass';

const {dialog} = window.remote;

class Walletcreate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        iconLoading:false,
        path:''
    };
  }
  UNSAFE_componentWillMount(){
  }
  savedialog = () => {
    var _this = this;
    dialog.showSaveDialog({
      title: '保存图像文件',
      defaultPath: '/',
      filters: [
          {
              name: 'JSON',
              extensions: ['json']
          }
      ]
    }).then(function (res) {
      _this.setState({ path: res.filePath });
    }).catch(function (error){
      console.log(error);
    })
  }
  createWallet = () => {
    var _this = this;
    this.setState({ iconLoading: true });
    var pass = document.getElementById("cpass").value;
    axios.post('http://localhost:8081', {
      "id" : "1",
      "method" : "CreateWallet",
      "params" : {
        "path" : _this.state.path,
        "password" : pass
      }
    })
    .then(function (res) {
      let _data = res.data;
      _this.setState({ iconLoading: false });
      if(_data.msgType == 3){
        message.success("钱包已创建",2);
      }else{
        message.info("钱包文件选择错误，请检查后重试",2);
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
              <Input placeholder="请选择文件存储位置" disabled value={this.state.path}/>
              <Button onClick={this.savedialog}>选择路径</Button>
              
                    <CheckPass/>
              <Input.Password id="cpass" placeholder="input password" maxLength="50" onChange={this.checkinput} onPressEnter={this.openWallet}/>
              <Button onClick={this.createWallet} loading={this.state.iconLoading}>创建钱包</Button>
          </div>
      </div>
    );
  }
} 

export default Walletcreate;