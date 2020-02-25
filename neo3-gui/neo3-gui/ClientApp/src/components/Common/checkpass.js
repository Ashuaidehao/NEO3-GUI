import React from 'react';
import { Input,message } from 'antd';

class CheckPass extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        show: true,
        hint:"输入正确"
    };
  }
  toTrim = (e) => {
    let _val = e.target.value;
    e.target.value = _val.trim()
  }
  notNull = (num) =>{
    let _finput = this.refs.fInput.input.value;
    let _sinput = this.refs.sInput.input.value;

    if(!_finput){
        message.error('密码不可为空',2);return false;
    }
    if(num===0)return false;
    if(!_sinput){
        message.error('确认密码不可为空',2);return false;
    }
    return true;
  }
  onInpass = () => {
    if(!this.notNull(0)) return;
  }
  onVerify = () => {
    if(!this.notNull())return;
    let _finput = this.refs.fInput.input.value;
    let _sinput = this.refs.sInput.input.value;

    if(_finput !== _sinput){
        message.info('两次输入不一致，请确认后输入',2);
    }
  }
  render = () =>{
    return (
        <div className={this.props.priclass}>
            <Input
                type="password"
                className={this.props.cname}
                placeholder="输入密码"
                data-value="输入密码"
                onKeyUp={this.toTrim} 
                onBlur={this.onInpass} 
                ref="fInput"
            />
            <Input
                type="password"
                placeholder="确认密码"
                data-value="确认密码"
                className={this.props.cname}
                onKeyUp={this.toTrim}
                onBlur={this.onVerify} 
                ref="sInput"
            />
        </div>
    )
  }
}

export default CheckPass;