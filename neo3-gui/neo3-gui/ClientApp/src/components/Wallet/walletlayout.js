/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, message } from 'antd';
import MenuDown from '../Common/menudown';
import Topath from '../Common/topath';
import { walletStore } from "../../store/stores";
import {
  HomeOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";


const { Sider } = Layout;
const { SubMenu } = Menu;


@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Walletlayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      isopen: false
    };
  }
  componentDidMount = () => {
    this.getGas()
  }
  getGas = () => {
    var _this = this;
    const { t } = this.props;
    axios.post('http://localhost:8081', {
      "id": 51,
      "method": "ShowGas"
    })
      .then(function (response) {
        var _data = response.data;
        if (_data.msgType === -1) {
          message.info(t("wallet page.please open wallet"), 2);
          _this.setState({ topath: "/wallet" });
          return;
        }
        walletStore.setWalletState(true);
        _this.setState({ isopen: true });
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  render = () => {
    const walletOpen = this.props.walletStore.isOpen;
    const { isopen } = this.state;
    const { t } = this.props;
    return (
      <div style={{ height: '100%' }}>
        {walletOpen || isopen ? <Topath topath="/wallet/walletlist"></Topath> : <Topath topath="/wallet"></Topath>}
        <Sider style={{ height: '100%' }} >
          <Menu
            className="menu-scroll"
            theme="light"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <Menu.Item>
              <Link to="/"><HomeOutlined />{t("home page")}</Link>
            </Menu.Item>
            {walletOpen || isopen ? (
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <WalletOutlined />
                    <span>{t("wallet")}</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <Link to="/wallet/walletlist">{t("wallet page.accounts nav")}</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/wallet/transaction">{t("wallet page.transactions nav")}</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/wallet/transfer">{t("wallet page.transfer nav")}</Link>
                </Menu.Item>
              </SubMenu>
            ) : null}
            {!walletOpen && !isopen ? (
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <WalletOutlined />
                    <span>{t("wallet")}</span>
                  </span>
                }>
                <Menu.Item key="1">
                  <Link to="/wallet">{t("wallet page.accounts nav")}</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/wallet">{t("wallet page.transactions nav")}</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/wallet">{t("wallet page.transfer nav")}</Link>
                </Menu.Item>
              </SubMenu>
            ) : null}
          </Menu>
          <MenuDown isl={this.state.isopen} />
        </Sider>
      </div>
    );
  }
}

export default Walletlayout;