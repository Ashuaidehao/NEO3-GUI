import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Button, Input,Divider } from 'antd';
import Walletcreate from '../Wallet/create';

const {dialog} = window.remote;

class Walletprivate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        showElem: false,
        iconLoading:false,
        private:'',
        path:''
    };
  }
  changeTab = () => {
    this.setState(prevState => ({
      showElem: !prevState.showElem
    }));
  }
  toTrim = (e) =>{
    let _val = e.target.value;
    e.target.value = _val.trim()
  }
  notNull = () =>{
    let _finput = document.getElementsByClassName("pri-pass")[0].value;
    let _sinput = document.getElementsByClassName("pri-pass")[1].value;
    if(!_finput){
        message.error('密码不可为空',2);return false;
    }
    if(!_sinput){
        message.error('确认密码不可为空',2);return false;
    }
    return true;
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
  veriPrivate = () => {
    var _this = this;
    let _private = document.getElementById("privateKey").value;
    axios.post('http://localhost:8081', {
      "id":"20",
      "method": "VerifyPrivateKey",
      "params": [_private]
    })
    .then(function (res) {
      let _data = res.data;
      console.log(_data);
      if(_data.msgType === 3){
        _this.setState({ showElem: true });
        _this.setState({ private: _private});
      }else{
        message.info("私钥输入错误,请检查后输入",2);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  savePrivate = () =>{
    var _this = this;
    if(!this.notNull())return;
    this.setState({ iconLoading: true });
    var pass = document.getElementsByClassName("pri-pass")[1].value;
    axios.post('http://localhost:8081', {
      "id" : "1",
      "method" : "CreateWallet",
      "params" : {
        "path" : _this.state.path,
        "password" : pass,
        "privateKey": _this.state.private
      }
    })
    .then(function (res) {
      let _data = res.data;
      console.log(_data);
      if(_data.msgType === 3){
        message.success("钱包已创建",2);
        _this.setState({ iconLoading: false });
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
          <Input id="privateKey" value="L5EiKcecQfapmWKNatnZo1Zi6732kyDUNAZr618mdBAbPVS3M6cL" disabled={this.state.showElem} placeholder="导入HEX/WIF格式私钥" onKeyUp={this.toTrim} data-value="私钥"/>
          {!this.state.showElem?(
            <div>
              <Button onClick={this.veriPrivate}>下一步</Button>
            </div>
          ):null}
          {this.state.showElem?(
            <div>
                <Divider>钱包保存</Divider>
                <Walletcreate priclass="pri-class" cname="pri-pass" private={this.state.private}/>
            </div>
          ):null}
      </div>
    );
  }
  getpath = () =>{


  }
} 

export default Walletprivate;