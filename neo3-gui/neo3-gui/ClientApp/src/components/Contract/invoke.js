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

import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";

const { TextArea } = Input;
const { Content } = Layout;
const {dialog} = window.remote;
const {Option} = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@withTranslation()
@inject("walletStore")
@observer
@withRouter
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
        this.setState({
          hash:res.contractHash,
          methods:methods
        })
      });
    }
    searchContract = callback => {
      const { t } = this.props;
      let _hash = (this.refs.sinput.input.value).trim();
      if(!_hash){message.info(t("contract page.search input check"));return;}
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
          message.info(t("contract page.search fail"));
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
    makeParams = (data) =>{
      let _params = {
        "contractHash": this.state.hash,
        "method": this.state.methodname,
        "parameters":[],
        "cosigners":[],
        "sendTx": false
      };
      
      let inside = new Array();
      this.state.params.map((item)=>{
        item.value = data[item.name];
        inside = inside.concat(item)
      })
      if(inside) _params.parameters = inside;

      let cosigners = new Array();
      data.cosigners?data.cosigners.map((item)=>{
        let _list = {};
        _list.account = item;
        cosigners = cosigners.concat(_list)
      }):null;
      if(cosigners) _params.cosigners = cosigners;

      return _params;
    }
    onFill = () => {
      this.refs.formRef.setFieldsValue({
        tresult:this.state.tresult
      });
    };
    testInvoke = () => {
      const { t } = this.props;
      this.setState({
        tresult:"",
      },this.onFill());
      this.refs.formRef.validateFields().then(data => {
        let params = this.makeParams(data);

        this.invokeContract(params,res=>{
          this.setState({
            tresult:JSON.stringify(res),
          },this.onFill());
        });
      }).catch(function(res){
        console.log(res)
        message.error(t("input.checked"));
      })
    }
    invoke = fieldsValue =>{
      let params = this.makeParams(fieldsValue);
      params.sendTx = true;
      const { t } = this.props;
      this.setState({
        tresult:"",
      },this.onFill());
      this.invokeContract(params,res=>{
        Modal.info({
          title: t('contract page.invoke contract'),
          width: 600,
          content: (
            <div className="show-pri">
              <p>TxID : {res.result.txId?res.result.txId:"--"}</p>
              <p>GAS  : {res.result.gasConsumed?res.result.gasConsumed:"--"}</p>
            </div>
          ),
          okText:t('button.ok')
        });
      });
    }
    invokeContract = (params,callback) =>{
      console.log(params)
      const { t } = this.props;
      axios.post('http://localhost:8081', {
        "id":"1111",
        "method": "InvokeContract",
        "params": params
      })
      .then(function (res) {
        var _data = res.data;
        console.log(_data)
        if(_data.msgType === -1){
          Modal.error({
            title: t('contract page.fail title'),
            width: 600,
            content: (
              <div className="show-pri">
                <p>{t('error code')}: {_data.error.code}</p>
                <p>{t('error msg')}: {_data.error.message}</p>
              </div>
            ),
            okText: t('button.ok')
          });
          return;
        }else if(_data.msgType === 3){
          callback(_data)
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
    }
    render = () =>{
    const {methods,params,disabled} = this.state;
    const { t } = this.props;
    const accounts = this.props.walletStore.accountlist;
    return (
    <Layout className="gui-container">
      <Sync />
      <Content className="mt3">
        <Row gutter={[30, 0]}  className="bg-white pv4" style={{ 'minHeight': 'calc( 100vh - 150px )'}}>
          <Col span={24}>
            
          <a className="fix-btn" onClick={this.showDrawer}><SwapOutlined /></a>
          <Intitle content={t('contract page.invoke contract')}/>
          <Form ref="formRef" className="trans-form" onFinish={this.invoke}>
            <Row className="mt3">
              <Col span={20}>
                <Form.Item
                  name="hash"
                  label="ScriptHash"
                  rules={[
                    {
                      required: true,
                      message: t('contract page.search fail'),
                    },
                  ]}>
                  <Input ref="sinput" placeholder="Scripthash"/>
                </Form.Item>
                <Form.Item
                  name="method"
                  label={t("contract page.invoke method")}
                  rules={[
                    {
                      required: true,
                      message: t("input.required"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("contract page.select method")}
                    style={{ width: '100%'}}
                    onChange={this.showPara}>
                    {methods.map((item,index)=>{
                      return(
                      <Option key={index}>{item.name}</Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                {params[0]?<div className="param-title"><span>*</span> {t("contract page.parameters")} :</div>:null}
                {params.map((item, index) => {
                  return(
                    <Form.Item
                      {...layout}
                      className="param-input"
                      name={item.name}
                      key={item.name}
                      label={<span>{item.name}</span>}
                      rules={[
                        {
                          required: true,
                          message: t("input.required"),
                        },
                      ]}>
                      <Input placeholder={item.type}/>
                    </Form.Item>
                  )}
                )}
                <Form.Item
                  name="cosigners"
                  label={t("contract page.cosigners")}>
                  <Select
                    placeholder={t("contract page.choose account")}
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
                <Button className="w200 form-btn" onClick={this.showDetail}>{t("button.search")}</Button>
              </Col>
            </Row>
            <Form.Item className="text-c w200" >
              <Button type="primary"  htmlType="button" onClick={this.testInvoke}>
               {t('contract page.test invoke')}
              </Button>
            </Form.Item>
            <div className="pa3 mb4">
              <p className="mb5 bolder">{t('contract page.test result')}</p>
              <TextArea rows={3} value={this.state.tresult}/>
            </div>
            <Form.Item className="text-c w200">
              <Button type="primary" htmlType="submit" disabled={disabled} loading={this.state.iconLoading}>
                {t("button.send")}
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