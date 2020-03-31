/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Input, Row, Col, Button } from 'antd';
import Topath from '../Common/topath';
import { walletStore } from "../../store/stores";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";


const { dialog } = window.remote;

@withTranslation()
@withRouter
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
        _this.setState({ iconLoading: false });
        if (_data.msgType == 3) {
          message.success("钱包文件已打开", 3);
          walletStore.setWalletState(true);
          _this.props.history.push('/wallet/walletlist');
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
    const{t}=this.props;
    return (
      <div className="open">
        <Topath topath={this.state.topath}></Topath>
        <Row>
          <Col span={18}>
            <Input placeholder={t("please select file location")} ref="path" disabled value={this.state.path} />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={this.opendialog}>{t("select path")}</Button>
          </Col>
        </Row>
        <Input.Password placeholder={t("please input password")} ref="pass" maxLength={this.state.maxLength} onChange={this.checkinput} onPressEnter={this.openWallet} />
        <Button className="mt3 mb2" type="primary" onClick={this.verifi} loading={this.state.iconLoading}>{t("button.confirm")}</Button>
      </div>
    );
  }
}

export default Walletopen;
