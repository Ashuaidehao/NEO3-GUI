/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, List, Typography,Tag } from 'antd';
import Transfer from '../Transaction/transfer';
import AddressBook from '../Transaction/addressbook';


const { Sider, Content } = Layout;
const demo1 = [
  {
      "blockHeight": 155812,
      "hash": "0xc7f154d7ebb8b0519e5a1548c735d7f84f347fc9207fe697bd4529f199c5f896",
      "time": "2020-01-22T08:10:31.755Z",
      "timestamp": 1579680631755,
      "transfers": [
          {
              "from": "0x587fb1e813e1fd7955147a23edf904887a6707a3",
              "to": "0x3aa6c73ba3aba1ad38f73878c5505eabccf12d6d",
              "amount": "1",
              "symbol": "neo"
          }
      ]
  },
  {
      "blockHeight": 155830,
      "hash": "0x853c62fd5cb8fc98ec99d910eb18ac6744549ebf69c1be8fbb9689c8f7f64a73",
      "time": "2020-01-22T08:15:02.015Z",
      "timestamp": 1579680902015,
      "transfers": [
          {
              "from": "0x587fb1e813e1fd7955147a23edf904887a6707a3",
              "to": "0x3aa6c73ba3aba1ad38f73878c5505eabccf12d6d",
              "amount": "1",
              "symbol": "gas"
          }
      ]
  }
];

const demo = [
  {
      "blockHeight": 155812,
      "hash": "0xc7f154d7ebb8b0519e5a1548c735d7f84f347fc9207fe697bd4529f199c5f896",
      "time": "2020-01-22T08:10:31.755Z",
      "timestamp": 1579680631755,
      "transfers": [
          {
              "from": "0x587fb1e813e1fd7955147a23edf904887a6707a3",
              "to": "0x3aa6c73ba3aba1ad38f73878c5505eabccf12d6d",
              "amount": "1",
              "symbol": "neo"
          }
      ]
  },
  {
      "blockHeight": 155830,
      "hash": "0x853c62fd5cb8fc98ec99d910eb18ac6744549ebf69c1be8fbb9689c8f7f64a73",
      "time": "2020-01-22T08:15:02.015Z",
      "timestamp": 1579680902015,
      "transfers": [
          {
              "from": "0x587fb1e813e1fd7955147a23edf904887a6707a3",
              "to": "0x3aa6c73ba3aba1ad38f73878c5505eabccf12d6d",
              "amount": "1",
              "symbol": "gas"
          }
      ]
  }, {
    "blockHeight": 155812,
    "hash": "0xc7f154d7ebb8b0519e5a1548c735d7f84f347fc9207fe697bd4529f199c5f896",
    "time": "2020-01-22T08:10:31.755Z",
    "timestamp": 1579680631755,
    "transfers": [
        {
            "from": "0x587fb1e813e1fd7955147a23edf904887a6707a3",
            "to": "0x3aa6c73ba3aba1ad38f73878c5505eabccf12d6d",
            "amount": "1",
            "symbol": "neo"
        }
    ]
},
{
    "blockHeight": 155830,
    "hash": "0x853c62fd5cb8fc98ec99d910eb18ac6744549ebf69c1be8fbb9689c8f7f64a73",
    "time": "2020-01-22T08:15:02.015Z",
    "timestamp": 1579680902015,
    "transfers": [
        {
            "from": "0x587fb1e813e1fd7955147a23edf904887a6707a3",
            "to": "0x3aa6c73ba3aba1ad38f73878c5505eabccf12d6d",
            "amount": "1",
            "symbol": "gas"
        }
    ]
}
];

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
            dataSource={demo1}
            size="large"
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={
                  <div>
                    <Tag>{item.time}</Tag>
                    <a className="w400 ellipsis" title={item.hash}>{item.hash}</a>
                    <a onClick={this.copyHash(item.hash)}><Icon type="copy" /></a>
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
            dataSource={demo}
            size="large"
            renderItem={item => (
              <List.Item>
                
                <List.Item.Meta
                  title={
                  <div>
                    <Tag color="#87d068">{item.time}</Tag>
                    <a className="w400 ellipsis" title={item.hash}>{item.hash}</a>
                    <a onClick={this.copyHash(item.hash)}><Icon type="copy" /></a>
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