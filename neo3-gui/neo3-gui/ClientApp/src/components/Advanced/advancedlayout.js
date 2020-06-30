/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import MenuDown from '../Common/menudown'
import { walletStore } from "../../store/stores";
import {
  HomeOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";
import Datatrans from '../Common/datatrans';

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
  render = () => {
    const { t } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Sider className="menu-logo" style={{ height: '100%' }} >
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
            <SubMenu
            key="sub1"
            title={
              <span>
                <DisconnectOutlined />
                <span>{t("home.advanced")}</span>
              </span>
            }
            >
              <Menu.Item key="1"><Link to="/advanced">{t('advanced.tools')}</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/advanced/candidate">{t("advanced.candidate")}</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/advanced/vote">{t("advanced.vote")}</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/advanced/signature">{t("签名")}</Link></Menu.Item>
            </SubMenu>
          </Menu>
          <MenuDown />
        </Sider>
        <Datatrans visible={this.state.visible} onClose={this.onClose} />   
      </div>
    );
  }
}

export default Advancedlayout;