/* eslint-disable */ 
import React from 'react';
import { Tooltip, Input, Form, Icon,Typography } from 'antd';

const { Paragraph } = Typography;

class CheckPass extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        show: true,
        hint:"两次输入需要保持一致"
    };
  }
  onInpass = () =>{

  }
  onVerify = () => {
    let cname = this.props.cname ||"";
    let _list = document.getElementsByClassName(cname);
    if(_list.length<=0) return;
    console.log(_list)
    if(_list[0].value == _list[1].value){
        this.setState({
            show:false
        })
    }else{
        this.setState({
            hint:"两次输入不一致，请重新输入"
        })
    }
  }
  testIn = () =>{
  }
  render = () =>{
    return (
        <div className={this.props.priclass}>
            <Input
                type="password"
                onBlur={this.onInpass}
                className={this.props.cname}
                placeholder="输入密码"
            />
            <Input
                type="password"
                className={this.props.cname}
                onBlur={this.onVerify}
                placeholder="确认密码"
            />
            {this.state.show?(
                <div><Paragraph className="ml1">请确认两次输入的密码一致</Paragraph></div>
            ):null}
            {!this.state.show?(
                <div><Paragraph className="ml1">{this.state.hint}</Paragraph></div>
            ):null}
        </div>
    )
  }
}

export default CheckPass;