/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal,List, Button,Typography, message,Tag } from 'antd';
import Intitle from '../Common/intitle';

import {
  HomeOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const count = 5;

class Transaction extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        page: 1,
        allpage:1,
        limit:15,
        translist:[],
        loading: false,
        initLoading: true,
        showEle:true,
        data: [],
        loacl:"",
    };
  }
  componentDidMount() {
    this.setState({
      loacl:location.pathname
    })
    // this.getAltrans(this.props.info?this.props.info:null);
    this.getAlltrans(res => {
      this.setState({
        initLoading: false,
        data: res.result.list,
        translist: res.result.list,
        page:this.state.page+1,
        allcount: res.result.totalCount
      },()=>{});
    })
  }
  selTrans = (info) =>{
    var _this = this,add = {};
    
    let _hash = location.pathname.split(":")[1];
    if(_hash){
      console.log(111)
    }
    info = info || ["GetMyTransactions"];
    if((this.state.translist.length+this.state.limit) >= this.state.allcount){
      this.setState({showEle:false})
    }

  }
  getMytrans = callback => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "GetMyTransactions",
      "params":{
        "pageIndex":_this.state.page,
        "limit": _this.state.limit
      }
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
  getAlltrans = callback => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "QueryTransactions",
      "params":{
        "pageIndex":_this.state.page,
        "limit":_this.state.limit
      }
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
    this.selTrans();
    this.setState({
      loading: true,
    });
    this.getAlltrans(res => {
      const data = this.state.data.concat(res.result.list);
      const _page = this.state.page + 1;
      this.setState(
        {
          data:data,
          translist: data,
          loading: false,
          page: _page
        },
        () => {
          window.dispatchEvent(new Event('resize'));
          console.log(this.state);
        },
      );
    });
  }
  render = () =>{
    const {translist,loacl,initLoading,loading,showEle} = this.state;
    const loadMore = !initLoading && !loading && showEle ? (
      <div className="text-c mb3">
        <Button type="primary" onClick={this.loadMore}>加载更多</Button>
      </div>
    ) : null;
    return (
      <div>
        <Content className="mt3 mb4">
        <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )'}}>
              <Col span={24} className="bg-white pv4">
              <Intitle content={this.props.content||"最新交易"}/>
              <List
                header={<div><span>交易hash</span><span className="float-r ml4"><span className="wa-amount"></span>数量</span><span className="float-r">时间</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                loading={initLoading}
                loadMore={loadMore}
                dataSource={translist}
                className="font-s"
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={<Link to={loacl+":"+item.txId} title="查看详情">{item.txId}</Link>}
                    description={
                    <div className="font-s">
                        From：<span className="w300 ellipsis">{item.transfers[0].fromAddress?item.transfers[0].fromAddress:"--"}</span><br></br>
                        To：<span className="w300 ellipsis" >{item.transfers[0].toAddress?item.transfers[0].toAddress:"--"}</span>
                    </div>
                    }
                    />
                    <Typography>{item.blockTime}</Typography>
                    <Typography className="upcase ml4"><span className="wa-amount">{item.transfers[0].amount}</span>{item.transfers[0].symbol}</Typography>
                </List.Item>
                )}
              />
              </Col>
              <div className="pv1"></div>
          </Row>
        </Content>
      </div>
    );
  }
} 

export default Transaction;