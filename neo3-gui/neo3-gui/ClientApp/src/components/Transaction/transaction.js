/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal,List, Button,Typography, message,Tag } from 'antd';
import Intitle from '../Common/intitle';

import {
  HomeOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const count = 5;

@inject("walletStore")
@observer
@withRouter
class Transaction extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        page: 1,
        allpage:1,
        limit:15,
        params:{},
        translist:[],
        loading: false,
        initLoading: true,
        showEle:false,
        data: [],
        loacl:"",
    };
  }
  componentDidMount() {
    this.setState({
      loacl:location.pathname.split("/")[1]
    })
    console.log(location.pathname.split("/")[1])
    console.log(this.props.walletStore)
    // this.getAltrans(this.props.info?this.props.info:null);

    this.selTrans()
  }
  selTrans = () =>{
    let _hash = location.pathname.split(":")[1]
    let page = this.props.info?this.props.info:"all";
    var _params;

    if(page === "all"){
      _params ={
        "pageIndex":this.state.page,
        "limit": this.state.limit
      };
      this.getAlltrans(_params,res => {
        this.setState({
          initLoading: false,
          data: res.result.list,
          translist: res.result.list,
          page:this.state.page+1,
          allcount: res.result.totalCount
        },()=>{});
      })
    }else if(page === "blockdetail"){
      _params ={
        "pageIndex":this.state.page,
        "limit": this.state.limit
      };
      _params.blockHeight = Number(_hash);
      this.getAlltrans(_params,res => {
        this.setState({
          initLoading: false,
          data: res.result.list,
          translist: res.result.list,
          page:this.state.page+1,
          allcount: res.result.totalCount
        },()=>{console.log(this.state.params)});
      })
    }else if(page === "walletdetail"){
      _params ={
        "pageIndex":this.state.page,
        "limit": this.state.limit
      };
      _params.address = _hash;
      this.getMytrans(_params,res => {
        this.setState({
          initLoading: false,
          data: res.result.list,
          translist: res.result.list,
          page:this.state.page+1,
          allcount: res.result.totalCount
        },()=>{console.log(this.state.params)});
      })
    }else if( page === "wallettrans"){
      _params ={
        "pageIndex":this.state.page,
        "limit": this.state.limit
      };
      this.getMytrans(_params,res => {
        this.setState({
          initLoading: false,
          data: res.result.list,
          translist: res.result.list,
          page:this.state.page+1,
          allcount: res.result.totalCount
        },()=>{console.log(this.state.params)});
      })
    }

    var last = this.state.allcount - (this.state.page * this.state.limit);
    console.log(last);
  }
  getMytrans = (params,callback) => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "GetMyTransactions",
      "params": params
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
  getAlltrans = (params,callback) => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id":"51",
      "method": "QueryTransactions",
      "params": params
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
  // getAlltrans = (num,callback) => {
  //   console.log(num)
  //   var _this = this;
  //   console.log({
  //     "id":"51",
  //     "method": "QueryTransactions",
  //     "params":{
  //       "pageIndex":_this.state.page,
  //       "limit":_this.state.limit
  //     }
  //   })
  //   axios.post('http://localhost:8081', {
  //     "id":"51",
  //     "method": "QueryTransactions",
  //     "params":{
  //       "pageIndex":_this.state.page,
  //       "limit":_this.state.limit
  //     }
  //   })
  //   .then(function (response) {
  //     var _data = response.data;
  //     console.log(_data)
  //     if(_data.msgType === -1){
  //       message.error("查询失败");
  //       return;
  //     }else{
  //       callback(_data);
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //     console.log("error");
  //   });
  // };
  // loadMore = () =>{
  //   this.selTrans();
  //   this.setState({
  //     loading: true,
  //   });
  //   this.getMytrans(res => {
  //     const data = this.state.data.concat(res.result.list);
  //     const _page = this.state.page + 1;
  //     this.setState(
  //       {
  //         data:data,
  //         translist: data,
  //         loading: false,
  //         page: _page
  //       },
  //       () => {
  //         window.dispatchEvent(new Event('resize'));
  //         console.log(this.state);
  //       },
  //     );
  //   });
  // }
  madeParams = () =>{
    return {
      "pageIndex":this.state.page,
      "limit": this.state.limit
    };
  }
  loadMore = () =>{
    this.setState({
      loading: true,
    });
    var _params = this.madeParams();
    this.getAlltrans(_params,res => {
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
        {/* <Button type="primary" onClick={this.loadMyMore}>加载更多</Button> */}
        <Button type="primary" onClick={this.loadMore}>加载更多</Button>
      </div>
    ) : null;
    return (
      <div>
        <Content className="mt3 mb4">
        <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': '120px'}}>
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
                    title={<Link to={"/"+loacl+"/transaction:"+item.txId} title="查看详情">{item.txId}</Link>}
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