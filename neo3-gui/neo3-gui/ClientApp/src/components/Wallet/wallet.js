/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { Upload,message,Input, Button, Icon,Tabs } from 'antd';
import axios from 'axios';
import Walletopen from './open'
import Walletcreate from './create'
import Walletprivate from './private'
import Tabc from '../Common/Tab'

const remote = window.remote;
const { dialog } = window.remote;
const { TabPane } = Tabs;

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
  UNSAFE_componentWillMount(){
    console.log(111);
    // axios.post('http://localhost:8081', {
    //   "id":"1234",
    //   "method": "OpenWallet",
    //   "params": {
    //       "path": "C:\\Users\\18605\\Desktop\\2.neo3.json",
    //       "password":"123456"
    //   }
    // })
    // .then(function (response) {
    //   console.log(response);
      
    //   console.log("sucees");
    // })
    // .catch(function (error) {
    //   console.log(error);
    //   console.log("error");
    // });
  }
  savedialog = () => {
    dialog.showSaveDialog({
      title: '保存图像文件',
      defaultPath: '/',
      filters: [
          {
              name: 'JSON',
              extensions: ['json']
          }
      ]
    }).then(function (res) {
      console.log(res.filePath);

    })
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
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="打开钱包" key="1">
            <Walletopen />
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
        <br></br>
        <br></br>
        <br></br>
          <Link to='/'>回首页</Link><br />
          <Link to='/List'>去钱包内部列表</Link>
      </div>
    );
  }
  getpath = () =>{
    var _this = this;
    var file = document.getElementById("file").files[0];
    var _path = file?(file.path).replace(/\\/g,"\\"):"";
    console.log(_path);
    console.log(file.path);
    if(file){
        this.setState({
            path :_path
        })
    }else{
        message.info("钱包选择失败，请选择正确的文件格式",2);
    }
  }
  showMsg = () =>{

  }
  checkInput = () =>{
    console.log("input")
  }
  openWallet = () => {
    var path = this.state.path;
    var _this = this;
    console.log(path);
    console.log(file.path);
    var pass = document.getElementById("password").value;
    if(!path||!pass){
      message.error("请确认文件及密码",3);
      return;
    }
    this.setState({ iconLoading: true });
    // var ws = new WebSocket("ws://localhost:8081");
    // let da = {
    //   "id":"1234",
    //   "method": "OpenWallet",
    //   "params": {
    //     "path": path,
    //     "password": "123456"
    //   }
    // };
    // // let da = {
    // //   "id":"1234",
    // //   "method": "OpenWallet",
    // //   "params": {
    // //     "path": path,
    // //     "password": pass
    // //   }
    // // };
    // ws.onopen = function() {
      
    //   ws.send(JSON.stringify(da));
      
    //   console.log("数据发送中...");
    // };
    
    // ws.onmessage = function(e) {
    //     let data = JSON.parse(e.data);
    //     console.log(data)
    //     if(data.msgType == 3){
    //       _this.setState({ iconLoading: false });
    //       message.success("钱包文件已选择",2);
    //     }else{
    //       message.info("钱包文件或密码错误，请检查后重试",2);
    //     }
    // }
    
    // ws.onclose = function(e) {
    //     console.log(e);
    //     message.info("网络连接失败，请稍后再试",3);
    // }
    
    // ws.onerror = function(e) {
    //     console.log(e);
    //     message.info("error" + e);
    // }
  }
  renderFile = () =>{
    
  }
  renderPrivate = () =>{

  }
  renderEncrypted = () =>{

  }
  renderSave = () =>{

  }
  saveFile = () =>{

  }
} 

export default Wallet;