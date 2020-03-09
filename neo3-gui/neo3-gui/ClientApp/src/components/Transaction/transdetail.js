/* eslint-disable */ 
import React from 'react';
import axios from 'axios';
import { Layout, Row, Col,List,Typography, message,Button } from 'antd';
import Intitle from '../Common/intitle';

const { Content } = Layout;

class Transdetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default'
    };
  }
  componentDidMount(){
  }
  getTransdetail (){
    axios.post('http://localhost:8081', {
        "id":"51",
        "method": "GetMyTransactions",
        "params": add
    })
    .then(function (response) {
    console.log(add);
    var _data = response.data;
    console.log(_data)
    if(_data.msgType === -1){
        message.error("查询失败");
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
    return (
      <div>
        <Layout className="gui-container">
            <Content className="mt3">
                <Row gutter={[30, 0]}>
                    <Col span={24} className="bg-white pv4">
                    <Intitle content="交易详情"/>
                    {/* <List
                        header={<div>{address}</div>}
                        footer={<span></span>}
                        itemLayout="horizontal"
                        dataSource={assetlist}
                        renderItem={item => (
                        <List.Item className="wa-half">
                            <Typography.Text className="font-s">
                                <span className="upcase">{item.symbol}</span>
                                <span>{item.balance}</span>
                            </Typography.Text>
                        </List.Item>
                        )}
                    /> */}
                        <div className="mb4 text-r">
                            <Button type="primary" onClick={this.showPrivate}>显示私钥</Button>
                            <Button className="ml3" onClick={this.deleteConfirm}>删除地址</Button>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
        
      </div>
    );
  }
} 

export default Transdetail;