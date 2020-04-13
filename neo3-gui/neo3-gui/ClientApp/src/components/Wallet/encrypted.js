import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Button, Input,Divider } from 'antd';
import Walletcreate from '../Wallet/create';
import { withTranslation } from "react-i18next";


const {dialog} = window.remote;

@withTranslation()
class Walletencrypted extends React.Component{
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
    const { t }=this.props;
    let _finput = document.getElementsByClassName("pri-pass")[0].value;
    let _sinput = document.getElementsByClassName("pri-pass")[1].value;
    if(!_finput){
        message.error(t('wallet.please input password'),2);return false;
    }
    if(!_sinput){
        message.error(t('wallet.please input twice'),2);return false;
    }
    return true;
  }
  savedialog = () => {
    const { t }=this.props;
    var _this = this;
    dialog.showSaveDialog({
      title: t('wallet.save wallet file title'),
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
  veriNep2Private = () => {
    const{t}=this.props;
    var _this = this;
    
    this.setState({ iconLoading: true});
    let _private = document.getElementById("nep2Key").value;
    let _pass = document.getElementById("nep2Pass").value;
    axios.post('http://localhost:8081', {
      "id":"20",
      "method": "VerifyNep2Key",
      "params": {
        "nep2Key": _private,
        "password": _pass
      }
    })
    .then(function (res) {
      let _data = res.data;
      _this.setState({iconLoading: false});
      if(_data.msgType === 3){
        _this.setState({
          showElem: true,
          private: _data.result,
        });
      }else{
        message.info(t("wallet.encryred fail"),2);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    const{t}=this.props;
    return (
      <div>
        <Input id="nep2Key" disabled={this.state.showElem} placeholder={t("please input Encryped key")} onKeyUp={this.toTrim} data-value="私钥"/>
        {!this.state.showElem?(
          <div className="mt3">
            <Input.Password id="nep2Pass" disabled={this.state.showElem} placeholder={t("password")} onKeyUp={this.toTrim} data-value="私钥"/>
            <Button className="mt3" loading={this.state.iconLoading} onClick={this.veriNep2Private}>{t("button.next")}</Button>
          </div>
        ):null}
        {this.state.showElem?(
          <div>
              <Button className="mt3" onClick={this.changeTab}>{t("button.prev")}</Button>
              <Divider>{t("wallet.private key save wallet title")}</Divider>
              <Walletcreate priclass="pri-class" cname="pri-pass" private={this.state.private}/>
          </div>
        ):null}
      </div>
    );
  }
} 

export default Walletencrypted;