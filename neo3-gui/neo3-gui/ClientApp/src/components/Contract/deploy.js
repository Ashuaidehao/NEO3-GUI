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

const { Content } = Layout;
const { dialog } = window.remote;

const { TextArea } = Input;

class Contractdeploy extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
      mapath:"",
      expath:"",
      disabled:true,
      visible:false,
      cost:-1
      };
    }
    selectNef = () =>{
      this.opendialog( "nef",res =>{
        this.setState({ expath: res.filePaths[0] }
        ,()=>{this.onFill()});
      })
    }
    selectMani = () =>{
      this.opendialog( "manifest.json",res =>{
        this.setState({ mapath: res.filePaths[0] }
        ,()=>{this.onFill()});
      })
    }
    opendialog = (str,callback) => {
      str = str||"";
      console.log(str)
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
      console.log(this.refs.formRef)
      console.log(this.refs.formRef.getFieldsValue())
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
            tresult:JSON.stringify(res.result)
          },this.onFill());
        })
      }).catch(function(){
        message.error("请先选择文件");
      })
    }
    ondeploy = fieldsValue =>{
      let params = fieldsValue;
      params.sendTx = true;
      this.deployContract( "manifest.json",res =>{
        this.setState({ mapath: res.filePaths[0] }
        ,()=>{this.onFill()});
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
          message.info("试运行失败，请检查后再尝试");
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
    const {path,disabled,cost} = this.state;
    return (
      <Layout className="gui-container">
      <Sync />
      <Content className="mt3">
      <Row gutter={[30, 0]}>
        <Col span={24} className="bg-white pv4">
          <Intitle content="部署合约"/>
          <Form ref="formRef" className="trans-form mt3" onFinish={this.out}>
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
              <TextArea rows={3} value={this.state.tresult}/>
            </div>
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