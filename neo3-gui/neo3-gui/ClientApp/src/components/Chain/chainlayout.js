/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import MenuDown from '../Common/menudown'
import {
  HomeOutlined,
  RadiusUpleftOutlined
} from '@ant-design/icons';
import { withTranslation } from 'react-i18next';



const { Sider } = Layout;
const { SubMenu } = Menu;

@withTranslation()
class Chainlayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default'
    };
  }
  toHome = () => {
    location.href = location.origin;
  }
  render = () => {
    const { t } = this.props;
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
            <SubMenu
              key="sub1"
              title={
                <span>
                  <RadiusUpleftOutlined />
                  <span>{t("sideBar.blockchain")}</span>
                </span>
              }
            >
              <Menu.Item key="1" ><Link to="/chain">{t("sideBar.blocks")}</Link></Menu.Item>
              <Menu.Item key="2" ><Link to="/chain/transaction">{t("sideBar.transactions")}</Link></Menu.Item>
              <Menu.Item key="3" ><Link to="/chain/asset">{t("sideBar.assets")}</Link></Menu.Item>
            </SubMenu>
          </Menu>
          <MenuDown />
        </Sider>
      </div>
    );
  }
}

export default Chainlayout;