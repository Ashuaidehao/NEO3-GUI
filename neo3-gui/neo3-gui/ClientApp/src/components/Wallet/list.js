/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Row, Col,Icon,Input  } from 'antd';
import Sync from '../sync';

const { Header, Footer, Sider, Content } = Layout;

const remote = window.remote;
const {dialog} = window.remote;

class List extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        accountlist:[]
    };
  }
  UNSAFE_componentWillMount(){
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"1234",
      "method": "OpenWallet",
      "params": {
          "path": "C:\\Users\\18605\\Desktop\\2.neo3.json",
          "password":"123456"
      }
    })
    .then(function (response) {
      console.log(response);
      
      console.log("sucees");
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
    axios.post('http://localhost:8081', {
      "id": "1234",
      "method": "ListAddress",
      "params": {
        "count": 10
      }
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.state.accountlist = _data.result.accounts;
      console.log(_this.state);
      console.log("listadd");
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    const { size } = this.state;
    return (
      <div>
        <Link to='/'>回首页</Link><br />
        <Layout>
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Icon type="radius-setting" />
                  <span>账户列表</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="swap" />
                  <span>交易记录</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="dollar" />
                  <span>转账</span>
                </Menu.Item>
                <Menu.Item key="4">
                  <Icon type="snippets" />
                  <span>地址簿</span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
                <Content>Content</Content>
            </Layout>
        </Layout>
        <Layout theme='dark'>
          <Sync />
        </Layout>
      </div>
    );
  }
} 

export default List;