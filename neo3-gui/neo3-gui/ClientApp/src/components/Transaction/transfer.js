/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Alert , Input,
    Tooltip,
    Icon,
    InputNumber,
    Modal,
    Select,
    Row,
    Col,
    message,
    Button,
    AutoComplete,
  } from 'antd';
import {  Layout } from 'antd';
import Intitle from '../Common/intitle'
import '../../static/css/wallet.css'
import { Form, DatePicker, TimePicker } from 'antd';
import Sync from '../sync';

const { Option } = Select;
const { Content } = Layout;
const AutoCompleteOption = AutoComplete.Option;

const {dialog} = window.remote;

const { MonthPicker, RangePicker } = DatePicker;

class Transfer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        iconLoading:false,
        addresslist: [],
        selectadd:[]
    };
  }
  componentDidMount() {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1234",
      "method": "GetMyBalances",
      "params": {}
    })
    .then(function (response) {
      var _data = response.data;
      if(_data.msgType === -1){
        console.log("需要先打开钱包再进入页面");
        return;
      }
      _this.setState({
        addresslist:_data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error2");
    });
  }
  setAddress = target =>{
    target = target?target:0;
    let _detail = this.state.addresslist[target].balances;
    this.setState({
      selectadd: _detail
    })
  }
  getAsset = () =>{
    this.setState({
      neo:_data.result.accounts
    })
  }
  transfer = fieldsValue =>{
    let _sender = this.state.addresslist[fieldsValue.sender].address;
    let _this = this;
    this.setState({
      iconLoading:true
    })
    axios.post('http://localhost:8081', {
      "id":"5",
      "method": "SendToAddress",
      "params": {
        "sender":_sender,
        "receiver":fieldsValue.receiver.trim(),
        "amount":fieldsValue.amount,
        "asset":fieldsValue.asset
       }
    })
    .then(function (response) {
      var _data = response.data;
      _this.setState({ iconLoading: false });
      if(_data.msgType === -1){
        message.error("交易失败");
        message.error("这里需要根据几个不同的情况分析：资金不够、手续费不够、地址错误、其他");
        return;
      }else{
        Modal.info({
          title: '交易发送成功',
          content: (
            <div className="show-pri">
              <p>交易哈希：{_data.result.txId}</p>
            </div>
          ),
          okText:"确认"
        });
        _this.refs.formRef.resetFields()
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render() {
    const {size,addresslist,selectadd} = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
        <Form ref="formRef" className="trans-form" onFinish={this.transfer}>
          <Row gutter={[30, 0]}  className="bg-white pv4" style={{ 'minHeight': 'calc( 100vh - 150px )'}}>
            <Col span={24}>
              <Intitle content="转账"/>
              <div className="w400 mt2" style={{ 'minHeight': 'calc( 100vh - 350px )'}}>
                <Form.Item
                  name="sender"
                  label="付款地址"
                  rules={[
                    {
                      required: true,
                      message: '请选择要转出的地址',
                    },
                  ]}
                >
                <Select
                  size={size}
                  placeholder={"选择账户"}
                  style={{ width: '100%'}}
                  onChange={this.setAddress}>
                  {addresslist.map((item,index)=>{
                    return(
                    <Option key={index}>{item.address}</Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="receiver"
                label="收款地址"
                rules={[
                  {
                    required: true,
                    message: '请填写需要转入的 NEO3 地址',
                  },
                ]}
              >          
                <Input placeholder="输入账户" />
              </Form.Item>
              <Row>
                <Col span={15}>
                  <Form.Item
                    name="amount"
                    label="转账金额"
                    rules={[
                      {
                        required: true,
                        message: '请填写正确的转账金额',
                      },
                    ]}>
                    <InputNumber min={0} step={1} placeholder="转账金额"/>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name="asset"
                    label="发送资产"
                    rules={[
                      {
                        required: true,
                        message: '必填项',
                      },
                    ]}>
                    <Select
                      defaultValue="选择" 
                      style={{ width: '100%' }}
                      >
                      {selectadd.map((item,index)=>{
                      return(
                        <Option key={index} value={item.asset} title={item.symbol}><span className="trans-symbol">{item.symbol} </span><small>{item.balance}</small></Option>
                      )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
                <div className="text-c lighter">
                  <small>预计到账时间：20s  &nbsp;&nbsp;<i> (手续费 1 GAS)</i></small>
                </div>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={this.state.iconLoading}>
                    发送
                  </Button>
                </Form.Item>
              </div>
              <Alert 
                  className="mt2 mb4"
                  showIcon
                  type="info"
                  message="安全提示：请勿轻易向陌生人转账。请仔细确认收款账户、转账金额、资产类型。请仔细辨别相同资产名称的资产，避免被骗。请勿向其它区块链的收款账户（地址）转账。"
                  />
            </Col>
          </Row>
        </Form>
        </Content>
      </Layout>
    );
  }
}

export default Transfer;