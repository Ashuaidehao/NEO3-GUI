/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, message } from 'antd';
import MenuDown from '../Common/menudown';
import Topath from '../Common/topath';
import {
  HomeOutlined,
  WalletOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Walletlayout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        isopen: false
    };
  }
  componentDidMount = () =>{
    this.getGas()
  }
  getGas = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":51,
      "method": "ShowGas"
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType === -1){
        message.info("请打开钱包",2);
        _this.setState({topath:"/wallet"});
        return;
      }
      _this.setState({isopen:true});
      _this.setState({topath:"/wallet/walletlist"});
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  hint = () =>{
    this.getGas();
    if(this.state.isopen) return;
  }
  render = () =>{
    return (
      <div style={{ height: '100%'}}>
        <Topath topath={this.state.topath}></Topath>
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
            {!this.state.isopen?(
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <WalletOutlined />
                    <span>钱包</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <Link to="/wallet" onClick={this.hint}>账户列表</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/wallet" onClick={this.hint}>交易列表</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/wallet" onClick={this.hint}>转账</Link>
                </Menu.Item>
              </SubMenu>
            ):null}
            {this.state.isopen?(
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <WalletOutlined />
                    <span>钱包</span>
                  </span>
                }
              >
                <Menu.Item key="1">
                  <Link to="/wallet/walletlist">账户列表</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/wallet/transaction">交易记录</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/wallet/transfer">转账</Link>
                </Menu.Item>
              </SubMenu>
            ):null}
          </Menu>
          <MenuDown isl={this.state.isopen}/>
        </Sider>
      </div>
    );
  }
} 

export default Walletlayout;