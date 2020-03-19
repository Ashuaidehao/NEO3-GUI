/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, Modal,List, Button,Typography, message } from 'antd';
import Sync from '../sync';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import '../../static/css/wallet.css';
import Topath from '../Common/topath';
import {
  CloseCircleOutlined 
} from '@ant-design/icons';

const { confirm } = Modal;
const { Content } = Layout;

class Addressdetail extends React.Component{
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
    this.setState({address:_add})
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
      if(_data.msgType === -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }else{
        if(_data.result.length>0){
          _this.setState({
            assetlist:_data.result[0]
          })
        }         
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
      if(_data.msgType === -1){
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
  deleteConfirm = () =>{
    let _this = this;
    confirm({
      title: '该地址删除后无法恢复，是否确认删除？',
      icon: <CloseCircleOutlined />,
      okText: '删除',
      cancelText: '取消',
      onOk() {
        _this.delAddress();
      },
      onCancel() {
        console.log('Cancel');
      },
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
        if(_data.msgType === -1){
            console.log("需要先打开钱包再进入页面");
            return;
        }else{
            message.success("删除成功",2)
            _this.setState({topath:"/wallet/walletlist"});
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
          "address": _this.state.address
      }
    })
    .then(function (response) {
      var _data = response.data.result;
      if(_data.msgType === -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }else{
        Modal.info({
            title: '请妥善保存好您的私钥，切勿丢失。',
            content: (
              <div className="show-pri">
                <p>私钥：{_data.privateKey}</p>
                <p>WIF：{_data.wif}</p>
                <p>公钥：{_data.publicKey}</p>
              </div>
            ),
            okText:"确认"
        });
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
        <Layout className="gui-container wa-detail">
          
            <Topath topath={this.state.topath}></Topath>
            <Sync />

            <Content className="mt3">
            <Row gutter={[30, 0]}>
              <Col span={24} className="bg-white pv4">
                <Intitle content="账户列表"/>
                <List
                    header={<div>{address}</div>}
                    footer={<span></span>}
                    itemLayout="horizontal"
                    dataSource={assetlist.balances}
                    renderItem={item => (
                    <List.Item className="wa-half">
                        <Typography.Text className="font-s">
                            <span className="upcase">{item.symbol}</span>
                            <span>{item.balance}</span>
                        </Typography.Text>
                    </List.Item>
                    )}
                />
                <div className="mb4 text-r">
                    <Button type="primary" onClick={this.showPrivate}>显示私钥</Button>
                    <Button className="ml3" onClick={this.deleteConfirm}>删除地址</Button>
                </div>
              </Col>
            </Row>
            <Transaction info="walletdetail"content="交易列表"/>
            </Content>
        </Layout>
    );
  }
} 

export default Addressdetail;