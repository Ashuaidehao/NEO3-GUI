/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { message, Input, Row, Col, Button } from 'antd';
import { walletStore } from "../../store/stores";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons';
import { remote } from 'electron';



const { dialog } = remote;

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
    const { t } = this.props;
    var path = this.refs.path.input.value;
    var pass = this.refs.pass.input.value;
    if (!path || !pass) {
      message.error(t("wallet.please select file and input password"), 3);
      return;
    }
    this.setState({ iconLoading: true });
    this.openWallet();
  }
  openWallet = () => {
    const { t } = this.props;
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
          walletStore.setWalletState(true);
          let page = (location.pathname).search(/contract/g);
          if (page === 1) {
            _this.props.history.push('/contract');
          } else {
            message.success(t("wallet.wallet opened"), 3);
            _this.props.history.push('/wallet/walletlist');
          }
        } else {
          message.info(t("wallet.open wallet failed"), 2);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  opendialog = () => {
    const { t } = this.props;
    var _this = this;
    dialog.showOpenDialog({
      title: t("wallet.open wallet file"),
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
    const { t } = this.props;
    return (
      <div className="open">
        <Row>
          <Col span={18}>
            <Input
              disabled
              ref="path"
              placeholder={t("please select file location")}
              value={this.state.path}
              prefix={<UserOutlined />}/>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={this.opendialog}>{t("wallet.select path")}</Button>
          </Col>
        </Row>
        <Input.Password
          ref="pass"
          placeholder={t("please input password")}
          maxLength={this.state.maxLength}
          onChange={this.checkinput}
          onPressEnter={this.openWallet} 
          prefix={<LockOutlined />}/>
        <Button className="mt3 mb2" type="primary" onClick={this.verifi} loading={this.state.iconLoading}>{t("button.confirm")}</Button>
      </div>
    );
  }
}

export default Walletopen;
