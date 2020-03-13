/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input, message, Button,Row,Col } from 'antd';

const {dialog} = window.remote;

class Walletcreate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        show: true,
        iconLoading:false,
        hint:"输入正确"
    };
  }
  toTrim = (e) => {
    let _val = e.target.value;
    e.target.value = _val.trim();
  }
  notNull = (num) =>{
    let _fpass = this.refs.fPass.input.value;
    let _spass = this.refs.sPass.input.value;
    let _path = this.state.path;

    if(!_path){
        message.error('请选择钱包文件的存储位置',2);return false;
    }
    if(!_fpass){
        message.error('密码不可为空',2);return false;
    }
    if(num===0)return false;
    if(!_spass){
        message.error('确认密码不可为空',2);return false;
    }
    return true;
  }
  savedialog = () => {
    var _this = this;
    dialog.showSaveDialog({
      title: '保存钱包文件',
      defaultPath: '/',
      filters: [
          {
              name: 'JSON',
              extensions: ['json']
          }
      ]
    }).then(function (res) {
      _this.setState({ path: res.filePath });
    }).catch(function (error){
      console.log(error);
    })
  }
  createWallet = () => {
    if(!this.onVerify())return;

    var _this = this,_pass = this.refs.sPass.input.value;
    this.setState({ iconLoading: true });
    if(!_pass) return;
    axios.post('http://localhost:8081', {
      "id" : "1",
      "method" : "CreateWallet",
      "params" : {
        "path" : _this.state.path,
        "password" : _pass,
        "privateKey":_this.props.private||""
      }
    })
    .then(function (res) {
      let _data = res.data;
      _this.setState({ iconLoading: false });
      if(_data.msgType === 3){
        message.success("钱包已创建",2);
      }else{
        message.info("钱包创建失败，请检查后重试",2);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  onVerify = () => {
    if(!this.notNull())return;
    let _fpass = this.refs.fPass.input.value;
    let _spass = this.refs.sPass.input.value;

    if(_fpass !== _spass){
        message.info('两次输入不一致，请确认后输入',2);
        return false;
    }
    return true;
  }
  render = () =>{
    return (
      <div className={this.props.priclass} private={this.state.private}>
        <Row>
          <Col span={18}>
            <Input placeholder="请选择文件存储位置" ref="file" disabled value={this.state.path}/>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={this.savedialog}>选择路径</Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input
              type="password"
              className={this.props.cname}
              placeholder="输入密码"
              data-value="输入密码"
              onKeyUp={this.toTrim} 
              onBlur={this.onVerify} 
              ref="fPass"
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Input
              type="password"
              placeholder="确认密码"
              data-value="确认密码"
              className={this.props.cname}
              onKeyUp={this.toTrim}
              onBlur={this.onVerify} 
              ref="sPass"
            />
          </Col>
        </Row>
        <Button type="primary" onClick={this.createWallet} loading={this.state.iconLoading} ref="create">创建钱包</Button>
        <p className="mt3 mb2">
          <small>因钱包较为私密，在选择已有文件的情况下，不会进行覆盖操作。<br />
          如需要删除原始钱包文件，请手动删除。</small>
        </p>
      </div>
    )
  }
}

export default Walletcreate;