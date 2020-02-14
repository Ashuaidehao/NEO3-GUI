/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { Upload,message,Input, Button, Icon,Tabs } from 'antd';
import axios from 'axios';
import Walletopen from './open'
import Walletcreate from './create'
import Walletprivate from './private'
import Tabc from '../Common/tab'

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
          <Tabc changeTab={this.changeTab.bind(this)} content="显示/隐藏"/>
          <div>
            {this.state.showElem?(
              <div>显示</div>
            ):null}
            {!this.state.showElem?(
              <div>隐藏</div>
            ):null}
          </div>
          <Link to='/'>回首页</Link><br />
          <Link to='/Walletlist'>去钱包内部列表</Link>
          <div>
              <img></img>
              <input type="file" id="file" onChange={this.getpath} />
              <Input.Password id="" placeholder="input password" maxLength="50" onChange={this.checkinput} onPressEnter={this.openWallet}/>
              <Button onClick={this.openWallet} loading={this.state.iconLoading}>确认</Button>
              
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
  // getpath = () =>{
  //   var _this = this;
  //   var file = document.getElementById("file").files[0];
  //   var _path = file?(file.path).replace(/\\/g,"\\"):"";
  //   console.log(_path);
  //   console.log(file.path);
  //   if(file){
  //       this.setState({
  //           path :_path
  //       })
  //   }else{
  //       message.info("钱包选择失败，请选择正确的文件格式",2);
  //   }
  // }
  showMsg = () =>{

  }
  checkInput = () =>{
    console.log("input")
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