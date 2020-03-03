/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {Link} from 'react-router-dom';
import {  Layout, Menu,Row, Col ,message, Button, Icon,Tabs,Divider } from 'antd';
import axios from 'axios';
import Walletopen from './open'
import Walletcreate from './create'
import Walletprivate from './private'
import Walletlayout from './walletlayout'
import Sync from '../sync';


const remote = window.remote;
const { dialog } = window.remote;
const { TabPane } = Tabs;
const { Sider, Content,Footer } = Layout;
const { SubMenu } = Menu;


class Wallet extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        iconLoading:false,
        path:'',
        showElem:true
    };
  }
  static defaultProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`钱包导入成功`);
      } else if (info.file.status === 'error') {
        message.error(`钱包导入失败`);
      }
    },
  }
  changeTab(e){
    this.setState(prevState => ({
      showElem: !prevState.showElem
    }));
  }
  render = () =>{
    const { size } = this.state;
    const props = this.props;
    return (
        <Layout className="wa-container">
          <Sync />
          <div className="wa-content mt1">
            <div className="">

            </div>
            <div className="wa-link">
              {/* 设置一个显示值及返回路径 */}
              <a className="back" href="/home"><Icon type="arrow-left" /></a>
              <a className="close" href="/home"><Icon type="close" /></a>
            </div>
            <div className="logo mt5"></div>
            <div className="wa-open mt1">
              <Button type="primary">打开钱包文件</Button>
              <Button className="mt3 mb2" type="primary">创建钱包文件</Button>
              
              <Divider className="t-light">导入钱包</Divider>
              <Row justify="space-between">
                <Col span={6}><Button  size="small">私钥</Button></Col>
                <Col span={6} offset={3}><Button size="small">加密私钥</Button></Col>
                <Col span={6} offset={3}><Button size="small">助记词</Button></Col>
              </Row>
              <Walletopen />
            </div>
          </div>
          <Footer className="mt1">Copyright © Neo Team 2014-2019</Footer>
        
      
      <Link to='/wallet/walletlist'>去钱包打开页面</Link><br />

      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="打开钱包" key="1">
            
          </TabPane>
          <TabPane tab="创建钱包" key="2">
            <Walletcreate />
          </TabPane>
          <TabPane tab="私钥导入" key="3">
            <Walletprivate />
          </TabPane>
          <TabPane tab="加密私钥导入" disabled key="4">
            <Walletcreate />
          </TabPane>
          <TabPane tab="助记词导入" disabled key="5">
            <Walletcreate />
          </TabPane>
        </Tabs>

          <div>
            {this.state.showElem?(
              <div>显示</div>
            ):null}
            {!this.state.showElem?(
              <div>隐藏</div>
            ):null}
          </div>
      </div>

      </Layout>
    );
  }
} 

export default Wallet;