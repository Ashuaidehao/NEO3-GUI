/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal,List, Button,Typography, message,Tag } from 'antd';
import Intitle from '../Common/intitle';

const { Content } = Layout;

class Untransaction extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        untranslist:[],
        loacl:""
    };
  }
  componentDidMount() {
    this.setState({
      loacl:location.pathname
    })
    this.getUnconfirmtrans(this.props.info?this.props.info:null);
  }
  getUnconfirmtrans = (info) =>{
    var _this = this,add = {};
    info = info || ["GetMyUnconfirmedTransactions"];
    if(info.length>1){
      add = {
        "limit":100,
        "address":info[1]
      };
    }
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "GetMyUnconfirmedTransactions",
      "params": add
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if(_data.msgType == -1){
        message.error("未确认交易查询失败");
        return;
      }
      _this.setState({
        untranslist:_data.result
      })
      console.log(_data);
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () =>{
    const {untranslist} = this.state;
    return (
      <div>
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100px )'}}>
            <Col span={24} className="bg-white pv4">
            <Intitle content={this.props.content||"未确认交易"}/>
            <List
                header={<div><span>交易hash</span><span className="float-r wa-amount">数量</span><span className="float-r">时间</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                dataSource={untranslist}
                className="font-s"
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        title={<Link to={this.state.loacl+":"+item.txId} title="查看详情">{item.txId}</Link>}
                        description={
                        <div className="font-s">
                            From：<span className="w300 ellipsis">{item.transfers[0].fromAddress?item.transfers[0].fromAddress:"--"}</span><br></br>
                            To：<span className="w300 ellipsis" >{item.transfers[0].toAddress?item.transfers[0].toAddress:"--"}</span>
                        </div>}
                        />
                        <Typography>{item.blockTime}</Typography>
                        <Typography className="wa-amount upcase">{item.transfers[0].amount} {item.transfers[0].symbol}</Typography>
                    </List.Item>
                    )}/>
                </Col>
                <div className="pv1"></div>
            </Row>
        </Content>
      </div>
    );
  }
} 

export default Untransaction;