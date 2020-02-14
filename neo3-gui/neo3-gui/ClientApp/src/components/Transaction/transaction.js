/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Menu, Row, Col,Icon,List, Avatar  } from 'antd';
import Transfer from '../Transaction/transfer';
import logo from '../../static/images/logo.svg';

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
        console.log("需要先打开钱包再进入页面");
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
  render = () =>{
    const { accountlist } = this.state;
    return (
      <div>
        <Link to='/'>回首页</Link>
        <Row type="flex">
            <Col span={24} order={1}>
                <h1>交易记录</h1>
                <List
                itemLayout="horizontal"
                dataSource={accountlist}
                renderItem={item => (
                    <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={logo} />}
                        title={<a href="/" title="查看详情">{item.address}</a>}
                        description={<span>{item.neo}<b>NEO</b>{item.gas}<b>GAS</b></span>}
                    />
                    
                    </List.Item>
                )}
                />
            </Col>
        </Row>
        <Transfer/>
      </div>
    );
  }
} 

export default Transaction;