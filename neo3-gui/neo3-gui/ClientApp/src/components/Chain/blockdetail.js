/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Icon, Row, Col, Modal,List, Input,Typography, message,Tag } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';

const { Sider, Content } = Layout;

class Blockdetail extends React.Component{
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
      if(_data.msgType == -1){
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
      <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
            <Col span={24} className="bg-white pv4">
            <Intitle content={this.props.content||"最新交易"}/>
            <List
                header={<div><span>交易hash</span><span className="float-r ml4"><span className="wa-amount"></span>数量</span><span className="float-r">时间</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                dataSource={blocklist}
                className="font-s"
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={<Link to={"./transaction:"+item.blockHash} title="查看详情">{item.blockHeight}</Link>}
                    description={<div className="font-s">{item.blockHash}</div>}
                    />
                    <Typography>{item.blockHeight}</Typography>
                    <Typography>{item.blockTime}</Typography>
                    <Typography>{item.size}</Typography>
                    <Typography className="upcase ml4"><span className="wa-amount">{item.transactionCount}</span></Typography>
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
    );
  }
} 

export default Blockdetail;