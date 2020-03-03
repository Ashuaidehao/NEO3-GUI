/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, message, Row, Col,Icon,List, Avatar, Button  } from 'antd';
import Sync from '../sync';
import logo from '../../static/images/logo.svg';
import Transaction from '../Transaction/transaction';
import Walletlayout from './walletlayout'
import Intitle from '../Common/intitle'
import '../../static/css/wallet.css'

const { Sider, Content } = Layout;

class Walletlist extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        accountlist:[],
        iconLoading:false,
        gas:0
    };
  }
  UNSAFE_componentWillMount() {
  }
  componentDidMount() {
    this.getAddress();
    this.getAllasset();
    this.getGas();
  }
  getAllasset = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "12",
      "method": "GetMyTotalBalance",
      "params": {}
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        asset:_data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  getAddress = () =>{
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
      console.log(_data);
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        accountlist:_data.result.accounts
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  getGas = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":51,
      "method": "ShowGas"
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        gas:_data.result.unclaimedGas
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  claimGas = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":51,
      "method": "ClaimGas"
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }else if(_data.msgType=3){
        message.success("GAS 提取成功，请稍后刷新页面查看",3);
      }
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
          "address": "NdBqia8N7sknTpgheck3ZznFoLzWdbaBoK"
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  importPrivate = () =>{
    var _this = this.state;
    // var pass = document.getElementById("privateKey").value;
    // console.log(pass);
    axios.post('http://localhost:8081', {
      "id":"20",
      "method": "ImportWif",
      "params":["L5EiKcecQfapmWKNatnZo1Zi6732kyDUNAZr618mdBAbPVS3M6cL"]
    })
    .then(function (res) {
      let _data = res.data;
      console.log(_data);
      if(_data.msgType == 3){
        message.success("私钥打开成功",2);
      }else{
        message.info("私钥输入错误",2);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    const { accountlist,asset } = this.state;
    return (
      <Layout className="wa-container">
        
        <Sync />

        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'min-height': 'calc( 100vh - 135px )'}}>
            <Col span={13} className="bg-white pv4">
              <Intitle content="账户列表" show="true"/>
              <List
                itemLayout="horizontal"
                dataSource={accountlist}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Link to={"/wallet/walletlist:"+item.address} title="查看详情">{item.address}</Link>}
                      description={
                      <span className="f-xs">
                        <span className="mr2">NEO {item.neo}</span>
                        <span>GAS {item.gas}</span>
                      </span>}
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col span={10} offset={1} className="bg-white pv4">
              <Intitle content="资产列表"/>
              <div className="w200 mt4">
                  <Button className="w200" onClick={this.claimGas} loading={this.state.iconLoading}>提取 {this.state.gas} GAS</Button>
              </div>
            </Col>
          </Row>
          <div className="mt1 pv3">
              <Link to='/'>回首页</Link><br />
              <Link to='/Wallet'>去钱包打开页面</Link>
          </div>
          <Button onClick={this.addAddress}>创建新地址</Button>
          <Button onClick={this.showPrivate}>查看私钥</Button>
          <Button onClick={this.exitWallet}>退出钱包</Button>
          <Button onClick={this.importPrivate} className="mb1">导入私钥</Button>

          <Transaction ></Transaction>
        </Content>
      </Layout>
    );
  }
} 

export default Walletlist;