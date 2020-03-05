/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal,List, Button,Typography, message,Tag } from 'antd';
import Intitle from '../Common/intitle';

import {
  HomeOutlined
} from '@ant-design/icons';


const { Sider, Content } = Layout;

class Transaction extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        translist:[]
    };
  }
  componentDidMount() {
    console.log(this.props.info);
    this.getAlltrans(this.props.info?this.props.info:null);
  }
  getAlltrans = (info) =>{
    var _this = this,add = {};
    info = info || ["GetMyTransactions"];
    if(info.length>1){
      add = {
        "limit":100,
        "address":info[1]
      };
    }
    console.log(info[1]);
    console.log(add);
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "GetMyTransactions",
      "params": add
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if(_data.msgType == -1){
        message.error("查询失败");
        return;
      }
      _this.setState({
        translist:_data.result
      })
      console.log(_data);
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  copyHash = (str) => {
    return ()=>{
      str.select();
      document.execCommand('copy');
      console.log('复制成功');
    }
  }
  render = () =>{
    const {translist} = this.state;
    return (
      <div>
        {/* <Content className="mt3">
          <Row gutter={[30, 0]} type="flex">
              <Col span={24} className="bg-white pv4">
              <Intitle content="待确认交易"/>
              <List
                  header={<div><span>交易hash</span><span className="float-r wa-amount">数量</span><span className="float-r">时间</span></div>}
                  footer={<span></span>}
                  itemLayout="horizontal"
                  dataSource={translist}
                  className="font-s"
                  renderItem={item => (
                  <List.Item>
                      <List.Item.Meta
                      title={
                      <div>
                          <a className="w400 ellipsis" title={item.txId}>{item.txId}</a>
                      </div>}
                      description={
                      <div className="font-s">
                          From：<span className="w300 ellipsis">{item.transfers[0].fromAddress?item.transfers[0].fromAddress:"--"}</span><br></br>
                          To：<span className="w300 ellipsis" >{item.transfers[0].toAddress?item.transfers[0].toAddress:"--"}</span>
                      </div>}
                      />
                      <Typography>{item.blockTime}</Typography>
                      <Typography className="wa-amount upcase">{item.transfers[0].amount} {item.transfers[0].symbol}</Typography>
                  </List.Item>
                  )}
              />
              </Col>
              <div className="pv1"></div>
          </Row>
        </Content> */}
        <Content className="mt3">
        <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
              <Col span={24} className="bg-white pv4">
              <Intitle content={this.props.content||"最新交易"}/>
              <List
                  header={<div><span>交易hash</span><span className="float-r wa-amount">数量</span><span className="float-r">时间</span></div>}
                  footer={<span></span>}
                  itemLayout="horizontal"
                  dataSource={translist}
                  className="font-s"
                  renderItem={item => (
                  <List.Item>
                      <List.Item.Meta
                      title={
                      <div>
                          <a className="w400 ellipsis" title={item.txId}>{item.txId}</a>
                          {/* <a onClick={this.copyHash(item.hash)}><Icon type="copy" /></a> */}
                      </div>}
                      description={
                      <div className="font-s">
                          From：<span className="w300 ellipsis">{item.transfers[0].fromAddress?item.transfers[0].fromAddress:"--"}</span><br></br>
                          To：<span className="w300 ellipsis" >{item.transfers[0].toAddress?item.transfers[0].toAddress:"--"}</span>
                      </div>}
                      />
                      <Typography>{item.blockTime}</Typography>
                      <Typography className="wa-amount upcase">{item.transfers[0].amount} {item.transfers[0].symbol}</Typography>
                  </List.Item>
                  )}
              />
              {/* <div className="mb4" >
                  <Button type="primary">加载更多</Button>
              </div> */}
              </Col>
              <div className="pv1"></div>
          </Row>
        </Content>
      </div>
    );
  }
} 

export default Transaction;