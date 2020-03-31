/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { observer, inject } from "mobx-react";
import { Input,
    Icon,
    Cascader,
    Modal,
    Select,
    Row,
    Col,
    Form,
    message,
    Menu,
    Button,
  } from 'antd';
  
import Datatrans from '../Common/datatrans';
import {  Layout } from 'antd';
import Intitle from '../Common/intitle'
import '../../static/css/wallet.css'
import Sync from '../sync'

import { SwapOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Content } = Layout;
const {dialog} = window.remote;
const {Option} = Select;
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

@inject("walletStore")
class Contractinvoke extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
        path:"",
        disabled:false,
        visible: false,
        methods:[],
        params:[],
        methodname:""
      };
    }
    componentDidMount(){
      this.refs.formRef.setFieldsValue({
        hash: "0x8c23f196d8a1bfd103a9dcb1f9ccf0c611377d3b"
      })
      console.log(this.props.walletStore.accountlist)
      const accounts = this.props.walletStore.accountlist;
      
      console.log(accounts)
    }
    toHome = () =>{
      location.href=location.origin;
    }
    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
    onClose = () => {
      this.setState({
        visible: false,
      });
    };
    showDetail = () =>{
      this.searchContract(res=>{
        let list = new Array();
        list = res.entryPoint?list.concat(res.entryPoint):list;
        let methods = list.concat(res.methods);
        console.log(methods)
        this.setState({
          methods:methods
        })
      });
    }
    searchContract = callback => {
      
      // let _hash = (this.refs.sinput.input.value).trim();
      console.log(this.refs);
      console.log();
      let _hash = (this.refs.sinput.input.value).trim();
      // let _hash = "0x8c23f196d8a1bfd103a9dcb1f9ccf0c611377d3b";
      if(!_hash){message.info("请输入后再试");return;}
      axios.post('http://localhost:8081', {
          "id":"1111",
          "method": "GetContract",
          "params": {
            "contractHash":_hash
          }
      })
      .then(function (response) {
        var _data = response.data;
        console.log(_data);
        if(_data.msgType === -1){
          message.info("该合约hash不存在，请检查后再尝试");
          return;
        }else if(_data.msgType === 3){
          callback(_data.result.manifest.abi)
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
    }
    showPara = e => {
      this.setState({
        params:this.state.methods[e].parameters,
        methodname:this.state.methods[e].name
      })
    }
    invoke = fieldsValue =>{
      console.log(fieldsValue)

      let inside = new Array();
      this.state.params.map((item)=>{
        item.value = fieldsValue[item.name];
        inside = inside.concat(item)
      })
      
      // let cosigners = fieldsValue.cosigners;
      // this.state.params.map((item)=>{
      //   item.value = fieldsValue[item.name];
      //   inside = inside.concat(item)
      // })
      // console.log(inside)

      let cosigners = new Array();

      let params = {
        "contractHash": fieldsValue.hash,
        "method": this.state.methodname,
        "parameters": inside,
        "cosigners": fieldsValue.cosigners,
        "sendTx": false
    }
    console.log(params)
    // this.invokeContract(res=>{
    //   let list = new Array();
    //   list = res.entryPoint?list.concat(res.entryPoint):list;
    //   let methods = list.concat(res.methods);
    //   console.log(methods)
    //   this.setState({
    //     methods:methods
    //   })
    // });
    }
    invokeContract = (params,callback) =>{
      axios.post('http://localhost:8081', {
        "id":"1111",
        "method": "InvokeContract",
        "params": params
      })
      .then(function (response) {
        var _data = response.data;
        if(_data.msgType === -1){
          Modal.error({
            title: '运行失败，请检查后再尝试',
            width: 400,
            content: (
              <div className="show-pri">
                <p>失败码: {res.code}</p>
                <p>错误信息: {res.message}</p>
              </div>
            ),
            okText:"确认"
          });
          return;
        }else if(_data.msgType === 3){
          callback(_data.result)
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
    }
    render = () =>{
    const {methods,params,disabled} = this.state;
    
    const accounts = this.props.walletStore.accountlist;
    return (
    <Layout className="gui-container">
      <Sync />
      <Content className="mt3">
        <Row gutter={[30, 0]}  className="bg-white pv4" style={{ 'minHeight': 'calc( 100vh - 150px )'}}>
          <Col span={24}>
            
          <a className="fix-btn" onClick={this.showDrawer}><SwapOutlined /></a>
          <Intitle content="调用合约"/>
          <Form ref="formRef" className="trans-form" onFinish={this.invoke}>
            <Row className="mt3">
              <Col span={20}>
                <Form.Item
                  name="hash"
                  label="ScriptHash"
                  rules={[
                    {
                      required: true,
                      message: '请输入正确的合约hash',
                    },
                  ]}>
                  <Input ref="sinput" placeholder="输入Scripthash"/>
                </Form.Item>
                <Form.Item
                  name="method"
                  label="调用方法"
                  rules={[
                    {
                      required: true,
                      message: '请搜索后，选择要调用的方法',
                    },
                  ]}
                >
                  <Select
                    placeholder={"选择方法"}
                    style={{ width: '100%'}}
                    onChange={this.showPara}>
                    {methods.map((item,index)=>{
                      return(
                      <Option key={index}>{item.name}</Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                {params[0]?<div className="param-title"><span>*</span> 参数列表 :</div>:null}
                {params.map((item, index) => {
                    console.log(item)
                  return(
                    <Form.Item
                      {...layout}
                      className="param-input"
                      name={item.name}
                      key={item.name}
                      label={<span className="upcase">{item.name}</span>}
                      rules={[
                        {
                          required: true,
                        },
                      ]}>
                      <Input placeholder={item.type}/>
                    </Form.Item>
                  )}
                )}
                <Form.Item
                  name="cosigners"
                  label="附加签名">
                  <Select
                    placeholder={"选择账户"}
                    mode="tags"
                    style={{ width: '100%'}}>
                    {accounts.map((item,index)=>{
                      return(
                      <Option key={item.address}>{item.address}</Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button className="w200 form-btn" onClick={this.showDetail}>搜索</Button>
              </Col>
            </Row>
            <Form.Item className="text-c w200" >
              <Button type="primary"  htmlType="button" onClick={this.onTest}>
                试运行
              </Button>
            </Form.Item>
            <div className="pa3 mb4">
              <p className="mb5 bolder">运行结果</p>
              <TextArea rows={3} value={this.state.tresult}/>
            </div>
            {/* {cost>=0?<p className="text-c small mt4 mb0">手续费：{cost} GAS</p>:null} */}
            <Form.Item className="text-c w200">
              <Button type="primary" htmlType="submit" disabled={disabled} loading={this.state.iconLoading}>
                发送
              </Button>
            </Form.Item>
          </Form>
          </Col>
        </Row>
        
        <Datatrans visible={this.state.visible} onClose={this.onClose} />
      </Content>
    </Layout>
    );
  }
} 


export default Contractinvoke;