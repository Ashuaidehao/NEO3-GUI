/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, List, Typography, message } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';

const { Content } = Layout;

class Chainasset extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      assetlist: [],
    };
  }
  componentDidMount(){
    this.getAllblock();
  }
  getAllblock = (info) =>{
    var _this = this;
    axios.post('http://localhost:8081', {
        "id":"1111",
        "method": "GetAllAssets",
        "params": {}
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if(_data.msgType === -1){
        message.error("查询失败");
        return;
      }
      _this.setState({
        assetlist:_data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render(){
    const {assetlist} = this.state;
    return (
      <Layout className="gui-container">
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
            <Col span={24} className="bg-white pv4">
            <Intitle content="资产列表"/>
            <List
                itemLayout="horizontal"
                dataSource={assetlist}
                className="font-s"
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={<Link to={"/chain/detail:"+item.asset} title="查看详情">{item.name}</Link>}
                    description={<div className="font-s">{item.asset}</div>}
                    />
                    <Typography>asset：{item.asset}</Typography>||
                    <Typography>name：{item.name}</Typography>||
                    <Typography>symbol：{item.symbol}</Typography>||
                    <Typography>decimals：{item.decimals}</Typography>||
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

export default Chainasset;