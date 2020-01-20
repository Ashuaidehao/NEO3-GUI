/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { Upload,message,Layout, Button, Icon } from 'antd';
import { element } from 'prop-types';

const remote = window.remote;
const {dialog} = window.remote;
var ws = new WebSocket("ws://localhost:8081");

class Create extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
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

  }
  render = () =>{
    const { size } = this.state;
    const props = this.props;
    return (
      <div>
          <Link to='/'>回首页</Link>
          <div>
              <img></img>
              <Layout>
                <Upload {...props}>
                  <Button size={size} type="primary">
                    <Icon type="upload" style={{ fontSize: '15px' }}/>打开钱包
                  </Button>
                </Upload>
                <Button size={size}><Icon type="file-add" style={{ fontSize: '15px' }} />新建钱包</Button>
                <input type="file" id="file" onChange={this.getpath} />
                <Button onClick={this.openWallet} >确认</Button>
                <Button onClick={this.savedialog}></Button>
                <Button onClick={this.openWallet} >确认</Button>

              </Layout>
          </div>
          <div>
              <img></img>
              <input></input>
          </div>
      </div>
    );
  }
  getpath = () =>{


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

export default Create;