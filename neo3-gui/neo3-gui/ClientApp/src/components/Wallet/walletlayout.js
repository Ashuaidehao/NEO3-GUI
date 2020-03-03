/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {Link} from 'react-router-dom';
import {  Layout, Menu, Icon, message } from 'antd';
import MenuDown from '../Common/menudown'
import Walletdetail from './walletdetail';

import {Router, Route, Switch} from 'react-router-dom';


const { Sider } = Layout;
const { SubMenu } = Menu;


class Walletlayout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default'
    };
  }
  toPage = (e) =>{
    console.log(e.key);
    let _link = location.origin + "/Walletlist"
  }
  render = () =>{
    return (
      <div style={{ height: '100%'}}>
          <Sider style={{ height: '100%'}} >
            <Menu
              className="menu-scroll"
              theme="dark"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
            >
              <Menu.Item>
                <Link to="/"><Icon type="home" />主页</Link>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="radius-setting" />
                    <span>钱包</span>
                  </span>
                }
              >
                <Menu.Item key="1">账户列表</Menu.Item>
                <Menu.Item key="2">
                  <Link to="/wallet/trans">交易列表</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/wallet/transfer">转账</Link>
                </Menu.Item>

              </SubMenu>
            </Menu>
            <MenuDown />
          </Sider>
      </div>
    );
  }
} 

export default Walletlayout;