/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Row, Col,Icon,List, Avatar, Button  } from 'antd';
import Sync from '../sync';
import logo from '../../static/images/logo.svg';
import Transaction from '../Transaction/transaction';

const { Sider, Content } = Layout;

class Walletlist extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        accountlist:[]
    };
  }
  UNSAFE_componentWillMount() {
  }
  componentDidMount() {
    var _this = this;
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
      _this.setState({
        accountlist:_data.result.accounts
      })
      console.log("listadd");
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  addAddress = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"1",
      "method": "CreateAddress"
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      console.log(_data);

    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  showPrivate = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"123456",
      "method": "ShowPrivateKey",
      "params": {
          "address": "NiczZuY3zKVpX2ywVcSKJtAv7RwpCS9czi"
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      console.log(_data);
// "ad247e986a9cd1ca2b01c50cd6ad1ef8de39da91f7113fc506ee08465ce0a591"
// "ad247e986a9cd1ca2b01c50cd6ad1ef8de39da91f7113fc506ee08465ce0a591"
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  exitWallet = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1234",
      "method": "CloseWallet"
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      console.log(_data);

    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    const { accountlist } = this.state;
    return (
      <div>
        <Layout style={{ height: 'calc( 100vh - 35px )' }}>
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
                <Content>
                  <Link to='/'>回首页</Link><br />
                  <Button onClick={this.addAddress}>创建新地址</Button>
                  <Button onClick={this.showPrivate}>查看私钥</Button>
                  <Button onClick={this.exitWallet}>退出钱包</Button>
                  <Row type="flex">
                    <Col span={12} order={1}>
                      <h1>地址列表</h1>
                      {/* {
                        accountlist.map((item,index)=>{
                          return(
                              <div key={index}>
                                  <p>地址：{item.address}</p>
                                  <p>neo: {item.neo}</p>
                                  <p>gas: {item.gas}</p>
                              </div>
                          )
                        })
                      } */}
                      
                      <List
                        itemLayout="horizontal"
                        dataSource={accountlist}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar src={logo} />}
                              title={<a href="/" title="查看详情">{item.address}</a>}
                              description={<span>{item.neo}<b>NEO</b>{item.gas}<b>GAS</b></span>}
                            />
                            
                          </List.Item>
                        )}
                      />
                    </Col>
                    <Col span={12} order={2}>
                      <h1>资产列表</h1>
                    </Col>
                  </Row>

                  <Transaction></Transaction>
                </Content>
            </Layout>
        </Layout>
        <Layout theme='dark'>
          <Sync />
        </Layout>
      </div>
    );
  }
} 

export default Walletlist;