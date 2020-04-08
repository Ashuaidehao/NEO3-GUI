/* eslint-disable */
//just test replace wallet//
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Modal, List, Button, Typography, message,PageHeader } from 'antd';
import Sync from '../sync';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import '../../static/css/wallet.css';
import Topath from '../Common/topath';
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";


const { confirm } = Modal;
const { Content } = Layout;

@withTranslation()
class Walletdetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      address: "",
      assetlist: [],
      iconLoading: false,
      gas: 0,
    };
  }
  componentDidMount() {
    this.checkAddress();
    this.getBalances();
  }
  checkAddress = () => {
    let _add = location.pathname.split(":").pop();
    this.setState({ address: _add })
  }
  getBalances = () => {
    var _this = this;
    let _add = location.pathname.split(":").pop();
    console.log(_add)
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "GetMyBalances",
      "params": {
        "address": _add
      }
    })
      .then(function (response) {
        var _data = response.data;
        console.log(_data)
        if (_data.msgType === -1) {
          console.log("需要先打开钱包再进入页面");
          return;
        } else {
          if (_data.result.length > 0) {
            _this.setState({
              assetlist: _data.result[0]
            })
          }
        }
        console.log(_this.state)
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  getGas = () => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": 51,
      "method": "ShowGas"
    })
      .then(function (response) {
        var _data = response.data;
        if (_data.msgType === -1) {
          console.log("需要先打开钱包再进入页面");
          return;
        }
        _this.setState({
          gas: _data.result.unclaimedGas
        })
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  deleteConfirm = () => {
    let _this = this;
    let { t } = this.props;
    confirm({
      title: t("wallet page.delete account warning"),
      icon: <CloseCircleOutlined />,
      okText: t("button.delete"),
      cancelText: t("button.cancel"),
      onOk() {
        _this.delAddress();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  delAddress = () => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "DeleteAddress",
      "params": [_this.state.address]
    })
      .then(function (response) {
        var _data = response.data;
        if (_data.msgType === -1) {
          console.log("需要先打开钱包再进入页面");
          return;
        } else {
          message.success("删除成功", 2)
          _this.setState({ topath: "/wallet/walletlist" });
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  showPrivate = () => {
    var _this = this;
    let { t } = this.props;
    axios.post('http://localhost:8081', {
      "id": "123456",
      "method": "ShowPrivateKey",
      "params": {
        "address": _this.state.address
      }
    })
      .then(function (response) {
        var _data = response.data.result;
        if (_data.msgType === -1) {
          console.log("需要先打开钱包再进入页面");
          return;
        } else {
          Modal.info({
            title: t("wallet page.private key warning"),
            content: (
              <div className="show-pri">
                <p>{t("wallet page.private key")}: {_data.privateKey}</p>
                <p>WIF：{_data.wif}</p>
                <p>{t("wallet page.public key")}：{_data.publicKey}</p>
              </div>
            ),
            okText: t("button.ok")
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  render = () => {
    const { assetlist, address } = this.state;
    const { t } = this.props;
    return (
      <Layout className="gui-container wa-detail">

        <Topath topath={this.state.topath}></Topath>
        <Sync />

        <Content className="mt3">
          <Row gutter={[30, 0]}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("wallet page.accounts nav")}></PageHeader>
              <List
                header={<div>{address}</div>}
                footer={<span></span>}
                itemLayout="horizontal"
                dataSource={assetlist.balances}
                renderItem={item => (
                  <List.Item className="wa-half">
                    <Typography.Text className="font-s">
                      <span className="upcase">{item.symbol}</span>
                      <span>{item.balance}</span>
                    </Typography.Text>
                  </List.Item>
                )}
              />
              <div className="mb4 text-r">
                <Button type="primary" onClick={this.showPrivate}>{t("wallet page.show private key")}</Button>
                <Button className="ml3" onClick={this.deleteConfirm}>{t("wallet page.delete account")}</Button>
              </div>
            </Col>
          </Row>
          <Transaction page="walletdetail" content={t("wallet page.transactions nav")} />
        </Content>
      </Layout>
    );
  }
}

export default Walletdetail;