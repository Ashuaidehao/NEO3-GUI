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

class Walletdetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        address:"",
        assetlist:[],
        iconLoading:false,
        gas:0,
    };
  }
  componentDidMount() {
    this.checkAddress();
    this.getBalances();
  }
  checkAddress = () =>{
    let _add = location.pathname.split(":")[1];
    this.setState({
        address:_add
    })
  }
  getBalances = () =>{
    var _this = this;
    let _add = location.pathname.split(":")[1];
    axios.post('http://localhost:8081', {
        "id":"51",
        "method": "GetMyBalances",
        "params":{
            "address":_add
        }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }else{
          _this.setState({
            assetlist:_data.result
          })
      }
      console.log(_this.state)
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
  delAddress = () =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"1",
      "method": "DeleteAddress",
      "params":[_this.state.address]
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
  render = () =>{
    const { assetlist,address } = this.state;
    return (
        <Layout className="wa-container">
            <Sync />

            <Content className="mt3">
            <Row gutter={[30, 0]}>
                <Col span={28} className="bg-white pv4">
                {/* <Intitle content="账户列表" show="false"/> */}
                <Intitle content="账户列表"/>
                {
                assetlist.map((item,index)=>{
                    console.log(assetlist);
                  return(
                      <div key={index}>
                          <p>地址：{item.address}</p>
                          <p>neo: {item.symbol}</p>
                          <p>gas: {item.balance}</p>
                      </div>
                  )
                })
              }
                <List
                    header={<div>{this.state.address}</div>}
                    footer={<div>{address}</div>}
                    itemLayout="horizontal"
                    dataSource={assetlist}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        title={<a href={item.address} title="查看详情">{item.address}</a>}
                        description={
                        <span className="f-xs">
                            <span className="mr2">{item.symbol}</span>
                            <span>{item.balance}</span>
                        </span>}
                        />
                    </List.Item>
                    )}
                />
                </Col>
            </Row>
            <Row gutter={[30, 0]} className="mt3">
                <Col span={28} className="bg-white pv4">
                {/* <Intitle content="账户列表" show="false"/> */}
                <Intitle content="账户列表"/>
                <List
                
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    itemLayout="horizontal"
                    dataSource={assetlist}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        title={<a href={"~/walletlist:"+item.address} title="查看详情">{item.address}</a>}
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
            </Row>
            </Content>
        </Layout>
    );
  }
} 

export default Walletdetail;