/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import MenuDown from '../Common/menudown'
import { walletStore } from "../../store/stores";
import {
  HomeOutlined,
  RadiusUpleftOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";


const { Sider } = Layout;
const { SubMenu } = Menu;

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Advancedlayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default'
    };
  }
  componentDidMount() {
    this.getGas()
  }
  getGas = () => {
    axios.post('http://localhost:8081', {
      "id": 51,
      "method": "ShowGas"
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) { return; }
      walletStore.setWalletState(true);
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () => {
    const { t } = this.props;
    const walletOpen = this.props.walletStore.isOpen;
    return (
      <div style={{ height: '100%' }}>
        <Sider style={{ height: '100%' }} >
          <Menu
            className="menu-scroll"
            theme="light"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <Menu.Item>
              <Link to="/"><HomeOutlined />{t("sideBar.home")}</Link>
            </Menu.Item>
            {walletOpen ? (
              <SubMenu
              key="sub1"
              title={
                <span>
                  <RadiusUpleftOutlined />
                  <span>{t("home.advanced")}</span>
                </span>
              }
              >
                <Menu.Item key="1"><Link to="/advanced">{t("advanced.vote")}</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/advanced/vote">{t("advanced.vote")}</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/advanced/candidate">{t("advanced.candidate")}</Link></Menu.Item>
              </SubMenu>
            ) : null}
            {!walletOpen ? (
              <SubMenu
              key="sub1"
              title={
                <span>
                  <RadiusUpleftOutlined />
                  <span>{t("home.advanced")}</span>
                </span>
              }
              >
                <Menu.Item key="1"><Link to="/advanced">{t("advanced.vote")}</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/advanced/wallet">{t("advanced.vote")}</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/advanced/wallet">{t("advanced.candidate")}</Link></Menu.Item>
              </SubMenu>
            ) : null}
            
          </Menu>
          <MenuDown />
        </Sider>
      </div>
    );
  }
}

export default Advancedlayout;