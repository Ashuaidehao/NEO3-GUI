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
    const { accountlist } = this.state;
    return (
      <div>
        <Layout style={{ height: 'calc( 100vh - 35px )' }}>
            <Content>
              <Link to='/'>回首页</Link><br />
              <Link to='/Wallet'>去钱包打开页面</Link><br />
              <br />
              <br />
              <Button onClick={this.addAddress}>创建新地址</Button>
              <Button onClick={this.showPrivate}>查看私钥</Button>
              <Button onClick={this.exitWallet}>退出钱包</Button>
              <Button onClick={this.importPrivate}>导入私钥</Button>
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
      </div>
    );
  }
} 

export default Walletlist;