/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from "mobx-react";
import axios from 'axios';
import { Layout, message, Row, Col, List, Avatar, Button, Typography,PageHeader,Modal } from 'antd';
import '../../static/css/wallet.css'
import Sync from '../sync';
import { withTranslation } from "react-i18next";

import {
  PlusCircleOutlined
} from '@ant-design/icons';

const { Content } = Layout;

@withTranslation()
@inject("walletStore")
@observer
class Walletlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      assetlist: [],
      iconLoading: false,
      gas: 0
    };
  }
  componentDidMount() {
    this.getAddress();
    this.getAllasset();
    this.getGas();
  }
  getAllasset = () => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "12",
      "method": "GetMyTotalBalance",
      "params": {}
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if (_data.msgType === -1) {
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        assetlist: _data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  getAddress = () => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1234",
      "method": "ListAddress",
      "params": {
        "count": 10
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if (_data.msgType === -1) {
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.props.walletStore.setAccounts(_data.result.accounts);
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
      console.log(_data);
      if (_data.msgType == -1) {
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
  claimGas = () => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": 51,
      "method": "ClaimGas"
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) {
        console.log("需要先打开钱包再进入页面");
        return;
      } else if (_data.msgType = 3) {
        message.success("GAS 提取成功，请稍后刷新页面查看", 3);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  addAddress = () => {
    var _this = this;
    axios.post('http://localhost:8081', {
    "id": "1",
    "method": "CreateAddress"
    })
    .then(function (response) {
    var _data = response.data;
    if (_data.msgType === -1) {
        console.log("需要先打开钱包再进入页面");
        return;
    }
    message.success("钱包地址新建成功")
    _this.props.walletStore.addAccount(_data.result);
    })
    .catch(function (error) {
    console.log(error);
    console.log("error");
    });
  }
  importPrivate = () => {
      var _this = this.state;
      var pass = document.getElementById("privateKey").value;
      console.log(pass);
      axios.post('http://localhost:8081', {
      "id": "20",
      "method": "ImportWif",
      "params": [pass]
      })
      .then(function (res) {
      let _data = res.data;
      if (_data.msgType === 3) {
          message.success("私钥打开成功", 2);
      } else {
          message.info("私钥输入错误", 2);
      }
      })
      .catch(function (error) {
      console.log(error);
      console.log("error");
      });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  render() {
    const accounts = this.props.walletStore.accountlist;
    const { assetlist } = this.state;
    const { t } = this.props;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )' }}>
            <Col span={13} className="bg-white pv4">
              <div className="in-title">
                <h2 className="mb0">
                  {t("wallet page.accounts nav")}
                  <div className="wal-import float-r">
                      <PlusCircleOutlined className=""/>
                      <div className="wal-ul">
                        <ul>
                          <li><a onClick={this.addAddress}>创建新地址</a></li>
                          <li><a onClick={this.importPrivate}>导入私钥</a></li>
                        </ul>
                      </div>
                  </div>
                </h2>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={accounts}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Link to={"/wallet/walletlist:" + item.address} title={t("wallet page.show detail")}>{item.address}</Link>}
                      description={
                        <span className="f-s">
                          <span className="mr2">NEO {item.neo}</span>
                          <span>GAS {item.gas}</span>
                        </span>}
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col span={10} offset={1} className="bg-white pv4">
              <PageHeader title={t("wallet page.assets")} ></PageHeader>
              <List
                className="asset-list"
                itemLayout="horizontal"
                style={{ 'minHeight': 'calc( 100% - 135px )' }}
                dataSource={assetlist}
                header={<div><span>{t("asset hash")} <small></small></span><span className="float-r wa-amount">{t("wallet page.balance")}</span></div>}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        // <Avatar src="https://neo3.azureedge.net/images/gui/0x43cf98eddbe047e198a3e5d57006311442a0ca15.png" />
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        // <Avatar src={"https://neo3.azureedge.net/images/gui/"+item.asset+".png"} />
                      }
                      title={<span className="upcase">{item.symbol}</span>}
                      description={<span className="f-xs">{item.asset}</span>}
                    />
                    <Typography>{item.balance}</Typography>
                  </List.Item>
                )}
              />
              <div className="w200 mt4">
                <Button className="w200" onClick={this.claimGas} loading={this.state.iconLoading}>{t("wallet page.claim")} {this.state.gas} GAS</Button>
              </div>
            </Col>
          </Row>

          <Button className="mt3 mb1" type="primary" onClick={this.addAddress}>创建新地址</Button>
          {/* <br /><br />
          <Input type="text" ref="private" placeholder="请输入WIF格式的私钥" />
          <Button onClick={this.importPrivate} className="mb1">导入私钥</Button> */}

          <Modal
            title="Vertically centered modal dialog"
            centered
            visible={this.state.visible}
            onOk={() => this.handleOk}
            onCancel={() => this.handleCancel}
          >
            {this.state.modalPanel}
          </Modal>
        </Content>
      </Layout>
    );
  }
}

export default Walletlist;


const Private = () => {
  return (
    <div>
      私钥打开方式
    </div>
  )
};