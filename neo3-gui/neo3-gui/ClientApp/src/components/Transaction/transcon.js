/* eslint-disable */ 
import React from 'react';
import axios from 'axios';
import '../../static/css/trans.css';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, Tabs, Typography, message, Button, Divider } from 'antd';
import Translog from './translog';
import Transdetail from './transdetail';
import Intitle from '../Common/intitle';
import Datatrans from '../Common/datatrans';

import {ArrowRightOutlined,SwapOutlined} from '@ant-design/icons';

const { Content } = Layout;

const { TabPane } = Tabs;

class Transcon extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        visible: false,
        hashdetail: [],
        transfers: [],
        witnesses:[],
        attributes:[],
        notifies:[]
    };
  }
  componentDidMount(){
    this.getTransdetail(res => {
      this.setState({
        hashdetail: res,
        transfers: res.transfers,
        witnesses:res.witnesses,
        attributes:res.attributes,
        notifies: res.notifies,
      });
    });
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  getTransdetail = callback => {
    let _hash = location.pathname.split(":")[1];
    console.log(_hash)
    axios.post('http://localhost:8081', {
        "id":"51",
        "method": "GetTransaction",
        "params": {
          "txId":_hash
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if(_data.msgType === -1){
          message.error("查询失败");
          console.log(_data);
          return;
      }else{
          callback(_data.result);
      }
      console.log(_data)
    })
    .catch(function (error) {
    console.log(error);
    console.log("error");
    });
  }
  render = () =>{
    const {hashdetail,transfers,witnesses,attributes} = this.state;
    console.log(hashdetail);
    return (
      <Layout className="gui-container">
          <Content className="mt3">
              <Row gutter={[30, 0]} className="mb1">
                  <Col span={24} className="bg-white pv4">
                  <a className="fix-btn" onClick={this.showDrawer}><SwapOutlined /></a>
                  <Tabs className="tran-title" defaultActiveKey="1">
                    <TabPane tab="交易体" key="1">
                      {/* <Transdetail hashdetail={this.state.hashdetail}/> */}
                      <Detail hashdetail={hashdetail} />
                      <Translist transfers={transfers}/>
                      <Attrlist attributes={attributes}/>
                      <Witlist witnesses={witnesses}/>
                    </TabPane>
                    <TabPane tab="交易日志" key="2">
                      <Translog notifies={this.state.notifies} hash={hashdetail.txId}/>
                    </TabPane>
                  </Tabs>
                </Col>
            </Row>
            <Datatrans visible={this.state.visible} onClose={this.onClose} />
        </Content>
    </Layout>
    );
  }
} 

export default Transcon;


const Detail = ({ hashdetail }) => (
  <Row>
    <div className="hash-title pa3"><span>Hash: &nbsp;&nbsp;&nbsp;</span>{hashdetail.txId}</div>
    {console.log(hashdetail)}
    <Col span={12}>
        <ul className="detail-ul">
            <li><span className="hint">区块：</span><Link to={"/chain/detail:"+hashdetail.blockHeight}>{hashdetail.blockHeight}</Link></li>
            <li><span className="hint">时间戳：</span>{hashdetail.timestamp}</li>
            <li><span className="hint">网络费：</span>{hashdetail.networkFee?hashdetail.networkFee:'--'} GAS</li>
            <li><span className="hint">确认数：</span>{hashdetail.confirmations}</li>
        </ul>
    </Col>
    <Col span={12}>
        <ul className="detail-ul">
            <li><span className="hint">大小：</span>{hashdetail.size} 字节</li>
            <li><span className="hint">时间：</span>{hashdetail.blockTime}</li>
            <li><span className="hint">系统费：</span>{hashdetail.networkFee} GAS</li>
            <li><span className="hint">随机数：</span>{hashdetail.nonce}</li>
        </ul>
    </Col>
    <div className="hash-title pv3"></div>
    <Divider></Divider>
</Row>
);
const Translist = ({ transfers }) => (
    <Row>
      <Col span={24}>
        <div className="hash-title pa3 mt4 mb3">转账记录</div>
        {transfers.map((item,index)=>{
        return(
          <ul className="detail-ul border-under" key={index}>
            <li><span className="gray">转出</span><span className="detail-add">{item.fromAddress?item.fromAddress:"--"}</span></li>
            <li><span className="gray">转入</span><span className="detail-add">{item.toAddress?item.toAddress:"--"}</span></li>
            <li><span className="gray">金额</span><span className="detail-amount">{item.amount} {item.symbol}</span></li>
          </ul>
        )
        })}
        </Col>
    </Row>
);
const Attrlist = ({ attributes }) => (
  <Row>
    {console.log(attributes)}
    <Col span={24}>
      <div className="hash-title pa3 mt4 mb4">属性</div>
      <ul className="detail-ul ul-invo">
        <li><p><span className="font-n">attributes: </span>{attributes.data?attributes.data:"--"}</p></li>
      </ul>
    </Col>
    <Divider></Divider>
  </Row>
);
const Witlist = ({ witnesses }) => (
  <Row>
      <Col span={24}>
        <div className="hash-title pa3 mt4 mb4">见证人</div>
        {witnesses.map((item,index)=>{
          return(
          <ul className="detail-ul border-under" key={index}>
            <li>
              <p>调用脚本</p>
              <p className="trans-table">
                <span><span className="trans-type">HEX</span></span>
                <span>{item.invocationScript}</span>
              </p>
            </li>
            <li>
              <p>验证脚本</p>
              <p className="trans-table">
                <span><span className="trans-type">HEX</span></span>
                <span>{item.verificationScript}</span>
              </p>
            </li>
          </ul>
        )
        })}
      </Col>
    </Row>
);