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
  FileSyncOutlined
} from '@ant-design/icons';


const { Sider } = Layout;
const { SubMenu } = Menu;

class Consensuslayout extends React.Component{
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
              theme="dark"
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
                <Menu.Item key="1" onClick={this.toPage}>搜索合约</Menu.Item>
                <Menu.Item key="2" onClick={this.toPage}>部署合约</Menu.Item>
                <Menu.Item key="3" onClick={this.toPage}>调用合约</Menu.Item>
              </SubMenu>
            </Menu>
            <MenuDown />
          </Sider>
      </div>
    );
  }
} 

export default Consensuslayout;