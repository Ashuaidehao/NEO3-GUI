/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Button, Input } from 'antd';
import CheckPass from '../Common/checkpass';

const {dialog} = window.remote;

class Walletprivate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        showElem: false,
        cname:"pri-pass",
        path:''
    };
  }
  changeTab(e){
    this.setState(prevState => ({
      showElem: !prevState.showElem
    }));
  }
  checkdoub = () => {
    console.log("链接成功")
  }
  veriPrivate = () => {
    var _this = this;
    var pass = document.getElementById("privateKey").value;
    console.log(pass);
    axios.post('http://localhost:8081', {
      "id":"20",
      "method": "ImportWif",
      "params":["L5EiKcecQfapmWKNatnZo1Zi6732kyDUNAZr618mdBAbPVS3M6cL"]
    })
    .then(function (res) {
      let _data = res.data;
      console.log(_data);
      if(_data.msgType == 3){
        message.success("私钥打开成功",2);

        _this.setState({
          showElem:true
        })
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
              <Input id="privateKey" placeholder="导入WIF私钥" />
              {!this.state.showElem?(
                <Button onClick={this.veriPrivate}>私钥验证</Button>
              ):null}
              {!this.state.showElem?(
                <div>
                    {/* <CheckPass verify={this.checkdoub}/> */}
                    <CheckPass priclass="pri-class" cname={this.state.cname}/>
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