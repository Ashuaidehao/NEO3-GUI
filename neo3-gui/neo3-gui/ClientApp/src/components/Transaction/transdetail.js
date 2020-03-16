/* eslint-disable */ 
import React from 'react';
import axios from 'axios';
import '../../static/css/trans.css';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, Tabs, Typography, message, Button, Divider } from 'antd';

import {ArrowRightOutlined} from '@ant-design/icons';

class Transdetail extends React.Component{
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
    let res = this.props.hashdetail;
    this.setState({
      hashdetail: res,
    },()=>{
      console.log(res)
    });
  }
  render = () =>{
    const {hashdetail,transfers,witnesses,attributes} = this.state;
    return (
      <div className="info-detail">
        {/* <div className="f-1 pa3 mt5 mb4"><span>Hash: &nbsp;&nbsp;&nbsp;</span>{hashdetail.blockHash}</div> */}
        {/* <Row>
            <Col span={12}>
                <ul className="detail-ul">
                    <li><span>区块：</span><Link to={"/chain/detail:"+hashdetail.blockHeight}>{hashdetail.blockHeight}</Link></li>
                    <li><span>时间戳：</span>{hashdetail.timestamp}</li>
                    <li><span>网络费：</span>{hashdetail.networkFee?hashdetail.networkFee:'--'} GAS</li>
                    <li><span>确认数：</span>{hashdetail.confirmations}</li>
                </ul>
            </Col>
            <Col span={12}>
                <ul className="detail-ul">
                    <li><span>大小：</span>{hashdetail.size} 字节</li>
                    <li><span>时间：</span>{hashdetail.blockTime}</li>
                    <li><span>系统费：</span>{hashdetail.networkFee} GAS</li>
                    <li><span>随机数：</span>{hashdetail.nonce}</li>
                </ul>
            </Col>
        </Row>
        <Divider></Divider>
        <Row>
            <Col span={24}>
            <ul className="detail-ul">
            {transfers.map((item,index)=>{
            return(
                <li key={index}>
                <span className="detail-add">{item.fromAddress?item.fromAddress:"--"}</span>
                <ArrowRightOutlined/>
                <span className="detail-add">{item.toAddress?item.toAddress:"--"}</span>
                <span className="detail-amount text-r">{item.amount} {item.symbol}</span>
                </li>
            )
            })}
            </ul>
            </Col>
        </Row>
        <Divider></Divider>
        <Row>
            <Col span={24}>
                <ul className="detail-ul ul-invo">
                    <li><p><span className="font-n">attributes: </span>{attributes.data?attributes.data:"--"}</p></li>
                    {witnesses.map((item,index)=>{
                    return(
                        <li key={index}>
                        <p><span className="font-n">invocation: </span>{item.invocationScript}</p>
                        <p><span className="font-n">verification: </span>{item.verificationScript}</p>
                        </li>
                    )
                    })}
                </ul>
            </Col>
        </Row>
        <Divider></Divider>
        <Row>
            <Col span={24}>
                {/* <ul className="detail-ul ul-invo">
                    <li><p><span className="font-n">attributes: </span>{attributes.data?attributes.data:"--"}</p></li>
                    {witnesses.map((item,index)=>{
                    return(
                    <li key={index}>
                        <p><span className="font-n">invocation: </span>{item.invocationScript}</p>
                        <p><span className="font-n">verification: </span>{item.verificationScript}</p>
                    </li>
                    )
                    })}
                </ul> */}
            {/* </Col>
        </Row> */}
    </div>
    );
  }
} 

export default Transdetail;