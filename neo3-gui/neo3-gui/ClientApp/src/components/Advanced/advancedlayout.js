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
            <SubMenu
              key="sub1"
              title={
                <span>
                  <RadiusUpleftOutlined />
                  <span>{t("blockchain")}</span>
                </span>
              }
            >
              <Menu.Item key="1" ><Link to="/advanced">{t("blockchain page.blocks nav")}</Link></Menu.Item>
              <Menu.Item key="2" ><Link to="/advanced/transaction">{t("blockchain page.transactions nav")}</Link></Menu.Item>
              <Menu.Item key="3" ><Link to="/advanced/asset">{t("blockchain page.asset nav")}</Link></Menu.Item>
            </SubMenu>
          </Menu>
          <MenuDown />
        </Sider>
      </div>
    );
  }
}

export default Advancedlayout;