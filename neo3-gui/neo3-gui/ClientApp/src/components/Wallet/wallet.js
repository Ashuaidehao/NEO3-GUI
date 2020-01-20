/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { Upload,message,Input, Button, Icon } from 'antd';
import { element } from 'prop-types';

const remote = window.remote;
const {dialog} = window.remote;

class Wallet extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        iconLoading:false,
        path:''
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
  render = () =>{
    const { size } = this.state;
    const props = this.props;
    return (
      <div>
          <Link to='/'>回首页</Link>
          <div>
              <img></img>
              <input type="file" id="file" onChange={this.getpath} />
              <Input.Password id="password" placeholder="input password" maxLength="50" onChange={this.checkinput} onPressEnter={this.openWallet}/>
              <Button onClick={this.openWallet} loading={this.state.iconLoading}>确认</Button>
              <Button onClick={this.savedialog}>savedialog</Button>
          </div>
          <div>
                <Upload {...props}>
                  <Button size={size} type="primary">
                    <Icon type="upload" style={{ fontSize: '15px' }}/>打开钱包
                  </Button>
                </Upload>
                <Button size={size}><Icon type="file-add" style={{ fontSize: '15px' }} />新建钱包</Button>
          </div>
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
  checkinput = () =>{
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
    var ws = new WebSocket("ws://localhost:8081");
    let da = {
      "id":"1234",
      "method": "OpenWallet",
      "params": {
        "path": path,
        "password": "123456"
      }
    };
    // let da = {
    //   "id":"1234",
    //   "method": "OpenWallet",
    //   "params": {
    //     "path": path,
    //     "password": pass
    //   }
    // };
    ws.onopen = function() {
      
      ws.send(JSON.stringify(da));
      
      console.log("数据发送中...");
    };
    
    ws.onmessage = function(e) {
        let data = JSON.parse(e.data);
        console.log(data)
        if(data.msgType == 3){
          _this.setState({ iconLoading: false });
          message.success("钱包文件已选择",2);
        }else{
          message.info("钱包文件或密码错误，请检查后重试",2);
        }
    }
    
    ws.onclose = function(e) {
        console.log(e);
        message.info("网络连接失败，请稍后再试",3);
    }
    
    ws.onerror = function(e) {
        console.log(e);
        message.info("error" + e);
    }
  }
  renderFile = () =>{
    
  }
  renderPrivate = () =>{

  }
  renderEncrypted = () =>{

  }
  renderSave = () =>{

  }
  savefile = () =>{

  }
} 

export default Wallet;