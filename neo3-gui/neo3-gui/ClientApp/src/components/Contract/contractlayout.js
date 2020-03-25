/* eslint-disable */ 
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {  Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import MenuDown from '../Common/menudown'
import {
  HomeOutlined,
  FileSyncOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

@inject("walletStore")
@observer
@withRouter
class Contractlayout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        deploypath:"/contract/wallet",
        invokepath:"/contract/wallet"
    };
  }
  componentDidMount() {
    const walletOpen = this.props.walletStore.isOpen;
    if(walletOpen){
      this.setState({
        deploypath:"/contract/deploy",
        invokepath:"/contract/invoke"
      })
    }
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
                    <FileSyncOutlined />
                    <span>合约</span>
                  </span>
                }
              >
                <Menu.Item key="1" onClick={this.toPage}>
                  <Link to="/contract">搜索合约</Link>
                </Menu.Item>
                <Menu.Item key="2" onClick={this.toPage}>
                  <Link to={this.state.deploypath}>部署合约</Link>
                </Menu.Item>
                <Menu.Item key="3" onClick={this.toPage}>
                  <Link to={this.state.invokepath}>调用合约</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
            <MenuDown />
          </Sider>
      </div>
    );
  }
} 

export default Contractlayout;