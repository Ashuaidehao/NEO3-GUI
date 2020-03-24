/* eslint-disable */ 
import React from 'react';
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
import Intitle from '../Common/intitle'
import '../../static/css/wallet.css'
import Sync from '../sync'

const { Content } = Layout;
const {dialog} = window.remote;


class Contractinvoke extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
        path:"",
        disabled:false
      };
    }
    toHome = () =>{
      location.href=location.origin;
    }
    toPage = (e) =>{
    }
    selectNef = () =>{
      this.opendialog( res =>{
        this.setState({ path: res.filePaths }
        ,()=>{
          console.log(res)
          console.log(this.state)
        });
      })
    }
    opendialog = callback => {
      var _this = this;
      dialog.showOpenDialog({
        title: '保存钱包文件',
        defaultPath: '/',
        filters: [
          {
            name: 'JSON',
            extensions: ['json']
          }
        ]
      }).then(function (res) {
        callback(res);
      }).catch(function (error){
        console.log(error);
      })
    }
    out = fieldsValue =>{
      console.log(fieldsValue)
    }
    render = () =>{
    const {path} = this.state;
    return (
      <Layout className="gui-container">
      <Sync />
      <Content className="mt3">
      <Row gutter={[30, 0]}>
        <Col span={24} className="bg-white pv4">
          <Intitle content="调用合约"/>
          <div className="w400 mt1 pv1">
          </div>
        </Col>
      </Row>

      </Content>
    </Layout>
    );
  }
} 

export default Contractinvoke;