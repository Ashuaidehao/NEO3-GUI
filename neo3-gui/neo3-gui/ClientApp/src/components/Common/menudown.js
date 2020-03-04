/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import { message,  Icon } from 'antd';
import axios from 'axios';

class menuDown extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            showOut:false,
            showPass:false
        };
    }
    componentDidMount () {
        this.checkWallet();
        this.showPass();
    }
    showPass = () =>{
        let _path = location.href.search(/wallet/g);
        if(_path <= -1) return;
        this.setState({showPass:true});
    }
    checkWallet = () =>{
        var _this = this;
        axios.post('http://localhost:8081', {
            "id": "1",
            "method": "ShowGas"
        })
        .then(function (response) {
            var _data = response.data;
            if(_data.msgType == -1){
                _this.setState({showOut:false})
            }else{
                _this.setState({showOut:true})
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log("error");
        });
    }
    logout = () =>{
        var _this = this;
        axios.post('http://localhost:8081', {
          "id": "1234",
          "method": "CloseWallet"
        })
        .then(function () {
          _this.setState({
            showOut:false
          })
          message.success("钱包退出成功",2)
        })
        .catch(function (error) {
          console.log(error);
          console.log("error");
        });
    }
    render(){
        return (
            <div className="menu-down" id="Menu">
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
                        <span>修改密码{this.props.aaa}</span>
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