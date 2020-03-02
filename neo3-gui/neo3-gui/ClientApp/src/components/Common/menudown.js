/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { Upload,message,Input, Button, Icon } from 'antd';
import { element } from 'prop-types';
import axios from 'axios';
import { Steps } from 'antd';

const remote = window.remote;
const {dialog} = window.remote;

class menuDown extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            showOut:true,
            showPass:false
        };
    }
    componentDidMount () {
        this.showOut();
    }
    showOut (){
        let _path = location.href.search(/Wallet/g);
        if(_path <= -1) return;
        this.setState({showPass:true});
    }
    logout(){
        var _this = this;
        axios.post('http://localhost:8081', {
          "id": "1234",
          "method": "CloseWallet"
        })
        .then(function (response) {
          var _data = response.data;
          if(_data.msgType == -1){
            console.log("需要先打开钱包再进入页面");
            return;
          }
          console.log(_data);
    
        })
        .catch(function (error) {
          console.log(error);
          console.log("error");
        });
    }
    render(){
        return (
            <div className="menu-down">
                <ul>
                    {this.state.showOut?(
                    <li>
                        <a onClick={this.logout}>
                        <Icon type="logout" />
                        <span>登出钱包</span>
                        </a>
                    </li>
                    ):null}
                    {this.state.showOut&&this.state.showPass?(
                    <li>
                        <a>
                        <Icon type="key" />
                        <span>修改密码</span>
                        </a>
                    </li>
                    ):null}
                    <li>
                        <a>
                        <Icon type="setting" />
                        <span>设置</span>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
} 

export default menuDown;