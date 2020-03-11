/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, List, Typography, message,Button } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';

const { Content } = Layout;

const count = 3;

class Chain extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      initLoading: true,
      data: [],
      blocklist: [],
    };
  }
  componentDidMount(){
    this.getBlock(res => {
      this.setState({
        initLoading: false,
        data: res.result,
        blocklist: res.result,
        lastblock: res.result[1]?res.result[1].blockHeight:null
      },()=>{});
    });
  }
  getBlock = callback => {
    console.log(this.state.lastblock)
    let _params = this.state.lastblock?{
      "limit": 2,
      "height":this.state.lastblock
    }:{
      "limit": 2
    };
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "GetLastBlocks",
      "params": _params
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if(_data.msgType === -1){
        message.error("查询失败");
        return;
      }else{
        callback(_data);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  };
  loadMore = () =>{
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getBlock(res => {
      const data = this.state.data.concat(res.result);
      console.log(data);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          window.dispatchEvent(new Event('resize'));
        },
      );
    });

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
    const {initLoading,loading,blocklist} = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button type="primary" onClick={this.loadMore}>loading more</Button>
        </div>
      ) : null;
    return (
      <Layout className="gui-container">
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
            <Col span={24} className="bg-white pv4">
            <Intitle content="区块列表"/>
            <div ref="blockList">
              <List
                header={<div><span>区块信息</span><span className="float-r ml4"><span className="wa-amount">数量</span></span><span className="float-r">更新时间</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                loading={initLoading}
                loadMore={loadMore}
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
            </div>
              <div className="mb4" >
                  <a onClick={this.loadMore}>加载更多</a>
              </div>
              </Col>
              <div className="pv1"></div>
          </Row>
        </Content>
      </Layout>
    );
  }
} 

export default Chain;