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
        addresslist:[],
        iconLoading:false,
        gas:0,
    };
  }
  componentDidMount() {
    this.checkAddress();
    this.getBalances();
  }
  checkAddress = () =>{
    let _add = location.pathname.split(":").pop();
    this.setState({address:_add})
  }
  getBalances = () =>{
    var _this = this;
    let _add = location.pathname.split(":").pop();
    axios.post('http://localhost:8081', {
        "id":"51",
        "method": "GetAddressBalance",
        "params":{
            // "addresses":[_add]
        }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      console.log(response);
      if(_data.msgType === -1){
        console.log(_data);
        return;
      }else{
        if(_data.result.length>0){
          _this.setState({
            addresslist:_data.result,
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
  render = () =>{
    const { addresslist,address } = this.state;
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
                  dataSource={addresslist.balances}
                  renderItem={item => (
                  <List.Item className="wa-half">
                    <Typography.Text className="font-s">
                      <span className="upcase">{item.symbol}</span>
                      <span>{item.balance}</span>
                    </Typography.Text>
                  </List.Item>
                  )}
                />
                <div className="mb4 text-r"></div>
              </Col>
            </Row>
            <Transaction page="walletdetail" content="交易列表"/>
          </Content>
        </Layout>
    );
  }
} 

export default Addressdetail;