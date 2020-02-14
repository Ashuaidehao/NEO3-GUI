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
      var _op = _data.result.accounts;
      if(_data.msgType == -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        accountlist:_data.result.accounts
      })

      const selectlist = [];
      for (let i = 10; i < 36; i++) {
        selectlist.push(<Option key={i}>{i}</Option>);
      }
      _this.setState({
        selectlist:selectlist
      })
      console.log(selectlist);
    })
    .catch(function (error) {
      console.log(error);
      console.log("error2");
    });
  }
  render() {
    const {size} = this.state;
    return (
        <div>
            <Select size={size} defaultValue="请选择要转出的地址" style={{ width: 200 }}>
                {this.state.selectlist}
            </Select>
            <Input
            placeholder="Enter your username"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={
                <Tooltip title="Extra information">
                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
            }
            />

            <br />
            <br />

            <Input prefix="￥" suffix="RMB" />
        </div>
    );
  }
}

export default Transfer;