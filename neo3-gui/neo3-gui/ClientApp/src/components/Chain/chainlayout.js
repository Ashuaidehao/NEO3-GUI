/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {  Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import MenuDown from '../Common/menudown'
import {
  HomeOutlined,
  RadiusUpleftOutlined
} from '@ant-design/icons';


const { Sider } = Layout;
const { SubMenu } = Menu;

class Chainlayout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default'
    };
  }
  toHome = () =>{
    location.href=location.origin;
  }
  toPage = (e) =>{
  }
  render = () =>{
    return (
      <div style={{ height: '100%'}}>
          <Sider style={{ height: '100%'}} >
            <Menu
              className="menu-scroll"
              theme="light"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
            >
              <Menu.Item>
                <Link to="/"><HomeOutlined />主页</Link>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <RadiusUpleftOutlined />
                    <span>区块链</span>
                  </span>
                }
              >
                <Menu.Item key="1" onClick={this.toPage}><Link to="/chain">区块</Link></Menu.Item>
                <Menu.Item key="2" onClick={this.toPage}><Link to="/chain/transaction">交易</Link></Menu.Item>
                <Menu.Item key="3" onClick={this.toPage}><Link to="/chain">资产</Link></Menu.Item>
              </SubMenu>
            </Menu>
            <MenuDown />
          </Sider>
      </div>
    );
  }
} 

export default Chainlayout;