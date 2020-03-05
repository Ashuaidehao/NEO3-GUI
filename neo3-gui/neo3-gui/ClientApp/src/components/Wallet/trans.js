/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal,List, Button,Typography, message } from 'antd';
import Transfer from '../Transaction/transfer';
import AddressBook from '../Transaction/addressbook';
import Intitle from '../Common/intitle';


const { Sider, Content } = Layout;

class Wallettrans extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        translist:[]
    };
  }
  componentDidMount() {
    var _this = this;
    axios.post('http://localhost:8081', {
        "id":"51",
        "method": "GetMyTransactions",
        "params":{
        }
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType == -1){
        console.log(_data);
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
      <Layout className="wa-container">
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'min-height': 'calc( 100vh - 120px )'}}>
              <Col span={24} className="bg-white pv4">
              {/* <Intitle content="账户列表" show="false"/> */}
              <Intitle content="最新交易"/>
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
      </Layout>
    );
  }
} 

export default Wallettrans;