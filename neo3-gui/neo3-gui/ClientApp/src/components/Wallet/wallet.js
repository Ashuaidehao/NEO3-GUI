/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {Link} from 'react-router-dom';
import {  Layout,Row, Col ,message, Button,Tabs,Divider } from 'antd';
import axios from 'axios';
import Walletopen from './open'
import Walletcreate from './create'
import Walletprivate from './private'
import Sync from '../sync';

import {
  ArrowLeftOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Footer } = Layout;

class Wallet extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        iconLoading:false,
        showElem:true,
        children:'',
        path:'',
        login:false
    };
  }
  componentDidMount(){
  }
  changeTab(e){
    this.setState(prevState => ({
      showElem: !prevState.showElem
    }));
  }
  getInset = (ele) => {
    return () =>{
      this.setState({showElem: false})
      switch(ele){
        case 0:this.setState({children: <Walletopen />});break;
        case 1:this.setState({children: <Walletcreate />});break;
        case 2:this.setState({children: <Walletprivate />});break;
        case 3:this.setState({children: <Walletopen />});break;
        case 4:this.setState({children: <Walletopen />});break;
        default:this.setState({showElem: true});break;
      }
    }
  }
  render = () =>{
    return (
      <Layout className="gui-container">
        <Sync />
        <div className="wa-content mt2">
          <div className="wa-link">
            {/* 设置一个显示值及返回路径 */}
            {!this.state.showElem?(
              <a className="back" onClick={this.getInset(-1)} key="1"><ArrowLeftOutlined /></a>
            ):null}
            <a className="close" href="/home"><CloseOutlined /></a>
          </div>
          <div className="logo mt5"></div>
          <div className="wa-open mt2">
            {this.state.showElem?(
              <div>
                <Button type="primary" onClick={this.getInset(0)}>打开钱包文件</Button>
                <Button className="mt3 mb2" type="primary" onClick={this.getInset(1)}>创建钱包文件</Button>
                
                <Divider className="t-light">导入钱包</Divider>
                <Row justify="space-between">
                  <Col span={6}><Button  size="small" onClick={this.getInset(2)}>私钥</Button></Col>
                  <Col span={6} offset={3}><Button size="small" disabled>加密私钥</Button></Col>
                  <Col span={6} offset={3}><Button size="small" disabled>助记词</Button></Col>
                </Row>
              </div>
            ):null}
            {!this.state.showElem?(
              <div>{this.state.children}</div>
            ):null}
          </div>
        </div>
        <Footer className="mt1">Copyright © Neo Team 2014-2019</Footer>
      </Layout>
    );
  }
} 

export default Wallet;