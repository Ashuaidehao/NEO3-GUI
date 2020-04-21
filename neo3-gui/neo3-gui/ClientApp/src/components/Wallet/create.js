/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input, message, Button, Row, Col } from 'antd';
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
class Walletcreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      show: true,
      iconLoading: false,
      hint: "输入正确"
    };
  }
  toTrim = (e) => {
    let _val = e.target.value;
    e.target.value = _val.trim();
  }
  notNull = (num) => {
    const { t } = this.props;
    let _fpass = this.refs.fPass.input.value;
    let _spass = this.refs.sPass.input.value;
    let _path = this.state.path;

    if (!_path) {
      message.error(t("wallet.please select file path"), 2); return false;
    }
    if (!_fpass) {
      message.error(t("wallet.please input password"), 2); return false;
    }
    if (num === 0) return false;
    if (!_spass) {
      message.error(t("wallet.please confirm password"), 2); return false;
    }
    return true;
  }
  savedialog = () => {
    const { t } = this.props;
    var _this = this;
    dialog.showSaveDialog({
      title: t("wallet.save wallet file title"),
      defaultPath: '/',
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    }).then(function (res) {
      _this.setState({ path: res.filePath });
    }).catch(function (error) {
      console.log(error);
    })
  }
  createWallet = () => {
    if (!this.onVerify()) return;
    const { t } = this.props;

    var _this = this, _pass = this.refs.sPass.input.value;
    this.setState({ iconLoading: true });
    if (!_pass) return;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "CreateWallet",
      "params": {
        "path": _this.state.path,
        "password": _pass,
        "privateKey": _this.props.private || ""
      }
    })
      .then(function (res) {
        let _data = res.data;
        _this.setState({ iconLoading: false });
        if (_data.msgType === 3) {
          message.success(t("wallet.create wallet success"), 2);
          walletStore.setWalletState(true);

          
          let page = (location.pathname).search(/contract/g)>0?1:((location.pathname).search(/advanced/g)>0?2:-1);
          if(page === 1){
            _this.props.history.push('/contract');
          }else if(page === 2){
            _this.props.history.push('/advanced');
          }else{
            message.success(t("wallet.wallet opened"), 3);
            _this.props.history.push('/wallet/walletlist');
          }
        } else {
          message.info(t("wallet.create wallet fail"), 2);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  onVerify = () => {
    if (!this.notNull()) return;
    const { t } = this.props;
    let _fpass = this.refs.fPass.input.value;
    let _spass = this.refs.sPass.input.value;

    if (_fpass !== _spass) {
      message.info(t("wallet.password not match"), 2);
      return false;
    }
    return true;
  }
  render = () => {
    const { t } = this.props;
    return (
      <div className={this.props.priclass} private={this.state.private}>
        <Row>
          <Col span={18}>
            <Input
              disabled
              ref="file"
              placeholder={t("please select file location")}
              value={this.state.path}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={this.savedialog}>{t("wallet.select path")}</Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input
              type="password"
              className={this.props.cname}
              placeholder={t("please input password")}
              data-value={t("please input password")}
              onKeyUp={this.toTrim}
              onBlur={this.onVerify}
              ref="fPass"
              prefix={<LockOutlined />}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input
              type="password"
              placeholder={t("please confirm your password")}
              data-value={t("please confirm your password")}
              className={this.props.cname}
              onKeyUp={this.toTrim}
              onBlur={this.onVerify}
              ref="sPass"
              prefix={<LockOutlined />}
            />
          </Col>
        </Row>
        <Button type="primary" onClick={this.createWallet} loading={this.state.iconLoading} ref="create">{t("button.create wallet")}</Button>
        <p className="mt3 mb2">
          <small>
            {t("wallet.create warning")}
          </small>
        </p>
      </div>
    )
  }
}

export default Walletcreate;