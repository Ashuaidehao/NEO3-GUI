/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, List, Typography, message } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';

const { Content } = Layout;

class Chain extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      blocklist: [],
    };
  }
  componentDidMount(){
    this.getAllblock();
  }
  getAllblock = (info) =>{
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "GetLastBlocks",
      "params": {
        "limit": 50
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if(_data.msgType === -1){
        message.error("查询失败");
        return;
      }
      _this.setState({
        blocklist:_data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render(){
    const {blocklist} = this.state;
    return (
      <Layout className="gui-container">
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
            <Col span={24} className="bg-white pv4">
            <Intitle content="区块列表"/>
            <List
                header={<div><span>区块信息</span><span className="float-r ml4"><span className="wa-amount">数量</span></span><span className="float-r">更新时间</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                dataSource={blocklist}
                className="font-s"
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={<Link to={"/chain/detail:"+item.blockHeight} title="查看详情">{item.blockHeight}</Link>}
                    description={<div className="font-s">{item.blockHash}</div>}
                    />
                    <Typography>{item.blockTime}</Typography>
                    <Typography className="upcase ml4"><span className="wa-amount">{item.transactionCount}</span></Typography>
                </List.Item>
                )}
              />
              </Col>
              <div className="pv1"></div>
          </Row>
        </Content>
      </Layout>
    );
  }
} 

export default Chain;