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
      blockdetail: {},
      height:0
    };
  }
  componentDidMount(){
    this.getAllblock();
  }
  getAllblock = () =>{
    let _height = Number(location.pathname.split(":")[1]);
    console.log(_height)
    var _this = this;
    axios.post('http://localhost:8081', {
        "id":"1111",
        "method": "GetBlock",
        "params": {
            "index": _height
        }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType === -1){
        message.error("查询失败,该高度错误");
        return;
      }
      _this.setState({
        blockdetail:_data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render(){
    const {blockdetail} = this.state;
    return (
      <Layout className="gui-container">
          <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
            <Col span={24} className="bg-white pv4">
                <Intitle content="区块信息"/>
                <Link to>Hash: {blockdetail.blockHash}</Link>
                <Row>
                    <Col span={12}>
                        <ul>
                            <li><span>高度：</span>{blockdetail.blockHeight}</li>
                            <li><span>时间戳：</span>{blockdetail.blockHash}</li>
                            <li><span>网络费：</span>{blockdetail.blockHash}</li>
                            <li><span>确认数：</span>{blockdetail.blockHash}</li>
                            <li><span>上一区块：</span><Link>{blockdetail.blockHeight}</Link></li>
                        </ul>
                    </Col>
                    <Col span={12}>
                        <ul>
                            <li><span></span>{blockdetail.blockHash}</li>
                            <li><span></span>{blockdetail.blockHash}</li>
                            <li><span></span>{blockdetail.blockHash}</li>
                            <li><span></span>{blockdetail.blockHash}</li>
                            <li><span></span>{blockdetail.blockHash}</li>
                        </ul>
                    </Col>
                </Row>
              <div className="pv1"></div>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
} 

export default Blockdetail;