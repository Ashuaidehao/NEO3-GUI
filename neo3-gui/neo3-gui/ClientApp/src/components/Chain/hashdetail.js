/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, message,List,Typography,PageHeader } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';
import Sync from '../sync';

const { Content } = Layout;

class Blockdetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      blockdetail: {},
      hash:"",
      witness:"",
      nonce:0,
    };
  }
  componentDidMount(){
    let _h = location.pathname.split(":").pop();
    this.setHash(_h)();
    this.setState({
      local:location.pathname
    })
  }
  getAllblock = () =>{
    var _this = this;
    let _hash = this.state.hash;
    axios.post('http://localhost:8081', {
      "id":"1111",
        "method": "GetBlockByHash",
        "params": {
            "hash": _hash
          }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType === -1){
        message.error("查询失败,该hash错误");
        return;
      }
      _this.setState({
        blockdetail:_data.result,
        witness:_data.result.witness.scriptHash,
        nonce:_data.result.consensusData.nonce,
        translist:_data.result.transactions
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  setHash = (h) => {
    return () =>{
        this.setState({
            hash: h
          },() => this.getAllblock());
        }
      }
    render(){
      const {blockdetail,witness,nonce,translist,local} = this.state;
      return (
        <Layout className="gui-container">
          <Sync/> 
          <Content className="mt3">
          <Row gutter={[30, 0]} type="flex">
            <Col span={24} className="bg-white pv4">
              <PageHeader className="mb2" content="区块信息"></PageHeader>
              <div className="info-detail pv3">
                <div className="pa3"><span>Hash: &nbsp;&nbsp;&nbsp;</span>{blockdetail.blockHash}</div>
                <Row>
                    <Col span={12}>
                        <ul className="detail-ul">
                            <li><span>高度：</span>{blockdetail.blockHeight}</li>
                            <li><span>时间戳：</span>{blockdetail.blockTime}</li>
                            <li><span>网络费：</span>{blockdetail.networkFee?blockdetail.networkFee:'--'}</li>
                            <li><span>确认数：</span>{blockdetail.confirmations}</li>
                        </ul>
                    </Col>
                    <Col span={12}>
                        <ul className="detail-ul">
                            <li><span>大小：</span>{blockdetail.blockHeight}</li>
                            <li><span>随机数：</span>{nonce}</li>
                            <li><span>系统费：</span>{blockdetail.networkFee?blockdetail.networkFee:'--'}</li>
                            <li><span>见证人：</span>{witness}</li>
                        </ul>
                    </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row className="mt3 mb1" gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
            <Col span={24} className="bg-white pv4">
            <PageHeader title="交易"></PageHeader>
            <List
              header={<div><span>交易hash</span><span className="float-r ml4"><span className="wa-amount"></span>数量</span><span className="float-r">时间</span></div>}
              footer={<span></span>}
              itemLayout="horizontal"
              dataSource={translist}
              className="font-s"
              renderItem={item => (
              <List.Item>
                  <List.Item.Meta
                  title={<Link to={"/chain/transaction:"+item.txId} title="查看详情">{item.txId}</Link>}
                  description={
                  <div className="font-s">
                      From：<span className="w300 ellipsis">{item.transfers[0].fromAddress?item.transfers[0].fromAddress:"--"}</span><br></br>
                      To：<span className="w300 ellipsis" >{item.transfers[0].toAddress?item.transfers[0].toAddress:"--"}</span>
                  </div>}
                  />
                  <Typography>{item.blockTime}</Typography>
                  <Typography className="upcase ml4"><span className="wa-amount">{item.transfers[0].amount}</span>{item.transfers[0].symbol}</Typography>
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

export default Blockdetail;