/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, List, Typography,Tag } from 'antd';
import Transfer from '../Transaction/transfer';
import AddressBook from '../Transaction/addressbook';
import {
  HomeOutlined
} from '@ant-design/icons';


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
        console.log(_data);
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
  copyHash = (str) => {
    return ()=>{
      str.select();
      document.execCommand('copy');
      console.log('复制成功');
    }
  }
  render = () =>{
    const {translist} = this.state;
    return (
      <div>
        <h1>待确认交易</h1>
        <Layout>
          {/* {demo.map((item,index)=>{
            console.log(item);
            return(
              <div key={index}>
                {item.time}<br />
                {item.hash}<br />
                {item.transfers[0].from}
                -->
                {item.transfers[0].to}<br />
                {item.transfers[0].amount}<br />
                {item.transfers[0].symbol}<br />
              </div>
            )
          })} */}
          <List
            dataSource={translist}
            size="large"
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={
                  <div>
                    <Tag>{item.time}</Tag>
                    <a className="w400 ellipsis" title={item.txId}>{item.txId}</a>
                    {/* <a onClick={this.copyHash(item.hash)}><Icon type="copy" /></a> */}
                  </div>}
                  description={
                  <div>
                    <span className="w200 ellipsis">{item.transfers[0].fromAddress}</span>
                     -> 
                    <span className="w200 ellipsis" >{item.transfers[0].toAddress}</span>
                    <b className="upcase">&nbsp;{item.transfers[0].amount} {item.transfers[0].symbol}</b>
                  </div>}
                />
              </List.Item>
            )}
          />
        </Layout>
        <h1>最新交易</h1>
        <Layout>
          {/* {demo.map((item,index)=>{
            console.log(item);
            return(
              <div key={index}>
                {item.time}<br />
                {item.hash}<br />
                {item.transfers[0].from}
                -->
                {item.transfers[0].to}<br />
                {item.transfers[0].amount}<br />
                {item.transfers[0].symbol}<br />
              </div>
            )
          })} */}
          <List
            dataSource={translist}
            size="large"
            renderItem={item => (
              <List.Item>
                
                <List.Item.Meta
                  title={
                  <div>
                    <Tag color="#87d068">{item.time}</Tag>
                    <a className="w400 ellipsis" title={item.hash}>{item.hash}</a>
                    {/* <a onClick={this.copyHash(item.hash)}><Icon type="copy" /></a> */}
                  </div>}
                  description={
                  <div>
                    <span className="w200 ellipsis">{item.transfers[0].from}</span>
                     -> 
                    <span className="w200 ellipsis" >{item.transfers[0].to}</span>
                    <b className="upcase">&nbsp;{item.transfers[0].amount} {item.transfers[0].symbol}</b>
                  </div>}
                />
              </List.Item>
            )}
          />
        </Layout>
        <Transfer/>
        <AddressBook />
      </div>
    );
  }
} 

export default Transaction;