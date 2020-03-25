/* eslint-disable */ 
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
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
import {  Layout } from 'antd';
import Intitle from '../Common/intitle';
import '../../static/css/wallet.css';
import Sync from '../sync';
import { FolderOpenOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";

const { Content } = Layout;
const { dialog } = window.remote;

const { TextArea } = Input;

@inject("walletStore")
@observer
@withRouter
class Contractdeploy extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
      mapath:"",
      expath:"",
      disabled:true,
      visible:false,
      func:"",
      cost:-1,
      isOpenDialog:false,
      };
    }
    selectNef = () =>{
      this.opendialog( "nef",res =>{
        this.setState({ 
          expath: res.filePaths[0],
          isOpenDialog:false,
        },()=>{this.onFill()});
      })
    }
    selectMani = () =>{
      this.opendialog( "manifest.json",res =>{
        this.setState({ 
          mapath: res.filePaths[0],
          isOpenDialog:false
        },()=>{this.onFill()});
      })
    }
    browseDialog = () => {
      const { isOpenDialog } = this.state;
      if(isOpenDialog === false) {
        return false;
      }else{
        return true;
      }
    }
    opendialog = (str,callback) => {
      if(this.browseDialog()) return;
      str = str||"";
      this.setState({disabled:true,isOpenDialog:true})
      dialog.showOpenDialog({
        title: '选择需要的'+str+'文件',
        defaultPath: '/',
        filters: [
          {
            name: '*',
            extensions: [str]
          }
        ]
      }).then(function (res) {
        callback(res);
      }).catch(function (error){
        console.log(error);
      })
    }
    onFill = () => {
      this.refs.formRef.setFieldsValue({
        nefPath: this.state.expath,
        manifestPath: this.state.mapath,
        tresult:this.state.tresult
      });
    };
    onTest = () =>{
      this.refs.formRef.validateFields().then(data => {
        let _params = data;
        _params.sendTx = false;
        this.deployContract( _params,res =>{
          console.log(res);
          this.setState({
            disabled:false,
            tresult:JSON.stringify(res.result),
            cost:res.result.gasConsumed
          },this.onFill());
        })
      }).catch(function(){
        message.error("请先选择文件");
      })
    }
    ondeploy = fieldsValue =>{
      let _params = fieldsValue;
      _params.sendTx = true;
      this.deployContract( _params,res =>{
        Modal.info({
          title: '交易发送成功，请等待区块确认',
          width: 600,
          content: (
            <div className="show-pri">
              <p>TxID: {res.result.txHash?res.result.txHash:"--"}</p>
              <p>ScrptHash: {res.result.contractHash?res.result.contractHash:"--"}</p>
              <p>Gas: {res.result.gasConsumed?res.result.gasConsumed:"--"}</p>
            </div>
          ),
          okText:"确认"
        });
        this.refs.formRef.setFieldsValue({
          nefPath: "",
          manifestPath: "",
          tresult:""
        });
      })
    }
    deployContract = (params,callback) =>{
      axios.post('http://localhost:8081', {
        "id":"1",
        "method": "DeployContract",
        "params": params
      })
      .then(function (response) {
        var _data = response.data;
        if(_data.msgType === -1){
          let res = _data.error;
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
          callback(_data);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
    }
    render = () =>{
    const {disabled,cost} = this.state;
    return (
      <Layout className="gui-container">
      <Sync />
      <Content className="mt3">
      <Row gutter={[30, 0]}>
        <Col span={24} className="bg-white pv4">
          <Intitle content="部署合约"/>
          <Form ref="formRef" className="trans-form mt3" onFinish={this.ondeploy}>
            <Form.Item
              name="nefPath"
              label="Neo Executable File (.nef)"
              onClick={this.selectNef}
              rules={[
                {
                  required: true,
                  message: '请选择文件后再试'
                },
              ]}
              >
              <Input className="dis-file" placeholder="选择文件" disabled suffix={<FolderOpenOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="manifestPath"
              label="Neo Contract Manifest (.manifest.json)"
              onClick={this.selectMani}
              rules={[
                {
                  required: true,
                  message: '请选择文件后再试'
                },
              ]}
              >
              <Input className="dis-file" placeholder="选择文件" disabled suffix={<FolderOpenOutlined />}
              />
            </Form.Item>
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
      </Content>
    </Layout>
    );
  }
} 

export default Contractdeploy;