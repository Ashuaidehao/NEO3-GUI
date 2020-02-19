/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, List, Typography } from 'antd';
import Transfer from '../Transaction/transfer';

const { Sider, Content } = Layout;
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
    return (
      <div>
        <Link to='/'>回首页</Link>
        <Layout>
          {demo.map((item,index)=>{
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
          })}
          <List
            dataSource={demo}
            renderItem={item => (
              <List.Item>
                <Typography.Text mark>{item.time}</Typography.Text> 
                <List.Item.Meta
                  title={<a className="w400 ellipsis" title={item.hash}>{item.hash}</a>}
                  description={<div><span className="w200 ellipsis">{item.transfers[0].from}</span> -> <span className="w200 ellipsis" >{item.transfers[0].to}</span></div>}
                />
              </List.Item>
            )}
          />
        </Layout>
        <Transfer/>
      </div>
    );
  }
} 

export default Transaction;