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
  FileSyncOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";


const { Sider } = Layout;
const { SubMenu } = Menu;

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Contractlayout extends React.Component {
  constructor(props) {
    super(props);
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
        {/* {walletOpen?<Topath topath="/contract"></Topath>:null} */}
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
                    <FileSyncOutlined />
                    <span>{t("sideBar.contract")}</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <Link to="/contract">{ t('sideBar.search contract') }</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/contract/deploy">{ t('sideBar.deploy contract') }</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/contract/invoke">{ t('sideBar.invoke contract') }</Link>
                </Menu.Item>
              </SubMenu>
            ) : null}
            {!walletOpen ? (
              <SubMenu
                key="sub1"
                defaultSelectedKeys={['1']}
                title={
                  <span>
                    <FileSyncOutlined />
                    <span>{t("sideBar.contract")}</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <Link to="/contract">{ t('sideBar.search contract') }</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/contract/wallet">{ t('sideBar.deploy contract') }</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/contract/wallet">{ t('sideBar.invoke contract') }</Link>
                </Menu.Item>
              </SubMenu>
            ) : null}
          </Menu>
          <MenuDown />
        </Sider>
      </div>
    );
  }
}

export default Contractlayout;