/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Input, Row, Col, Button } from 'antd';
import Topath from '../Common/topath';
import { walletStore } from "../../store/stores";

const { dialog } = window.remote;

class Walletopen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconLoading: false,
      islogin: false,
      path: "",
      maxLength: 30
    };
  }
  verifi = () => {
    var path = this.refs.path.input.value;
    var pass = this.refs.pass.input.value;
    if (!path || !pass) {
      message.error("请选择文件及输入密码", 3);
      return;
    }
    this.setState({ iconLoading: true });
    this.openWallet();
  }
  openWallet = () => {
    var _this = this;
    var pass = this.refs.pass.input.value;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "OpenWallet",
      "params": {
        "path": _this.state.path,
        "password": pass
      }
    })
      .then(function (res) {
        let _data = res.data;
        walletStore.setWalletState(true);
        _this.setState({ iconLoading: false });
        if (_data.msgType == 3) {
          message.success("钱包文件已打开", 3);
          _this.setState({ topath: "/wallet/walletlist" });
        } else {
          message.info("钱包文件或密码错误，请检查后重试", 2);
        }

      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  opendialog = () => {
    var _this = this;
    dialog.showOpenDialog({
      title: '打开钱包文件',
      defaultPath: '/',
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    }).then(function (res) {
      _this.setState({ path: res.filePaths[0] });
    }).catch(function (error) {
      console.log(error);
    })
  }
  render() {
    return (
      <div className="open">
        <Topath topath={this.state.topath}></Topath>
        <Row>
          <Col span={18}>
            <Input placeholder="请选择文件存储位置" ref="path" disabled value={this.state.path} />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={this.opendialog}>选择路径</Button>
          </Col>
        </Row>
        <Input.Password placeholder="input password" ref="pass" maxLength={this.state.maxLength} onChange={this.checkinput} onPressEnter={this.openWallet} />
        <Button className="mt3 mb2" type="primary" onClick={this.verifi} loading={this.state.iconLoading}>确认</Button>
      </div>
    );
  }
  openWallet2 = () => {
    var path = this.state.path;
    var _this = this;
    console.log(path);
    console.log(file.path);
    var pass = document.getElementById("password").value;
    if (!path || !pass) {
      message.error("请确认文件及密码", 3);
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
