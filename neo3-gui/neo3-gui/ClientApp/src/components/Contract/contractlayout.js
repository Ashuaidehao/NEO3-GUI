/* eslint-disable */ 
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import {  Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import MenuDown from '../Common/menudown'
import Topath from '../Common/topath';
import { walletStore } from "../../store/stores";
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
        topath:""
    };
  }
  componentDidMount() {
    this.getGas()
  }
  getGas = () =>{
    axios.post('http://localhost:8081', {
      "id":51,
      "method": "ShowGas"
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType === -1){return;}
      walletStore.setWalletState(true);
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    const walletOpen = this.props.walletStore.isOpen;
    console.log(walletOpen)
    return (
      <div style={{ height: '100%'}}>
          {/* {walletOpen?<Topath topath="/contract"></Topath>:null} */}
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

              {walletOpen ? (
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <FileSyncOutlined />
                    <span>钱包</span>
                  </span>
                }
                >
                  <Menu.Item key="1">
                    <Link to="/contract">搜索合约</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/contract/deploy">部署合约</Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/contract/invoke">调用合约</Link>
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
                    <span>合约</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <Link to="/contract">搜索合约</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/contract/wallet">部署合约</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/contract/wallet">调用合约</Link>
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