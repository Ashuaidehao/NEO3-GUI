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
        selectadd:0
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
    })
    .catch(function (error) {
      console.log(error);
      console.log("error2");
    });
  }
  setAddress = (target) =>{
    var _this = this;
    this.setState({
      selectadd:_this.state.accountlist[target]
    })

  }
  getAsset = () =>{
    this.setState({
      neo:_data.result.accounts
    })
  }
  verifyInput = () =>{
    
  }
  transfer = () =>{

  }
  render() {
    const {size,accountlist,selectadd} = this.state;
    
    return (
        <div>
          <h1>转账</h1>

            <Select
              size={size}
              defaultValue={"请选择要转出的地址"}
              style={{ width: 400, marginRight: '3%'}}
              onChange={this.setAddress}>
              {accountlist.map((item,index)=>{
                return(
                <Option key={index}>{item.address}</Option>
                )
              })}
            </Select>
            <Input
             placeholder="请输入要转到 NEO3 地址"  style={{ width: 400 }}
            />
            <br />
            <Input
              type="text"
              placeholder="请输入转账金额" 
              style={{ width: 250, marginRight: 20 }}
            />
            <Select
              style={{ width: 130 }}
              defaultValue="资产选择" 
              >
              <Option value="neo">NEO <small>{selectadd.neo}</small></Option>
              <Option value="gas">GAS <small>{selectadd.gas}</small></Option>
            </Select>
            <br />
            <div>
              <Input
                style={{ width: 250 }}
                placeholder="手续费(GAS)"
                suffix={
                 <Tooltip title="在网络拥堵时加快交易速度">
                 <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                 </Tooltip>}
              />
            </div>

            <br />
            <Button onClick={this.transfer}>发送</Button> <small>预计到账时间：20s</small>
        </div>
    );
  }
}

export default Transfer;