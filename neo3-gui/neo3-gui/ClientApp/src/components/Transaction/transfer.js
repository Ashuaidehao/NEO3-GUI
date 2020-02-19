/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
  } from 'antd';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const {dialog} = window.remote;

class Transfer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        accountlist: [],
        selectlist:[]
    };
  }
  componentDidMount() {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1234",
      "method": "ListAddress",
      "params": {
        "count": 10
      }
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        accountlist:_data.result.accounts
      })
      
      // var _op = _data.result.accounts;
      // const selectlist = [];
      // _op.forEach((item,index)=>{
      //   selectlist.push(
      //     <Option key={index}>
      //       {item.address}
      //     </Option>
      //   )
      // });
      // _this.setState({
      //   selectlist:selectlist
      // })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error2");
    });
  }
  render() {
    const {size,accountlist} = this.state;
    return (
        <div>
          <h1>转账</h1>
            <Select size={size} defaultValue="请选择要转出的地址" style={{ width: 200 }}>
              {accountlist.map((item,index)=>{
                return(
                    <Option key={index}>{item.address}</Option>
                )
              })}
            </Select>
            <Input
            placeholder="Enter your username"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={
                <Tooltip title="Extra information">
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>}/>

            <br />
            <br />

            <Input prefix="￥" suffix="RMB" />
        </div>
    );
  }
}

export default Transfer;