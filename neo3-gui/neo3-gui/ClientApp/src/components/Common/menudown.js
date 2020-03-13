/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import 'antd/dist/antd.css';
import { message } from 'antd';
import axios from 'axios';
import {
    LogoutOutlined,
    KeyOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { withRouter } from "react-router-dom";



@inject("walletStore")
@observer
@withRouter
class menuDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPass: false
        };

    }
    componentDidMount() {
        this.showPass();
    }
    showPass = () => {
        let _path = location.href.search(/wallet/g);
        if (_path <= -1) return;
        this.setState({ showPass: true });
    }    
    logout = () => {
        axios.post('http://localhost:8081', {
            "id": "1",
            "method": "ShowGas"
        })
        .then(function (response) {
            var _data = response.data;
            if(_data.msgType === -1){
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
            .then(()=> {
                message.success("钱包退出成功", 2);
                this.props.walletStore.logout();
                this.props.history.push('/');
            })
            .catch(function (error) {
                console.log(error);
                console.log("error");
            });
    }
    render() {
        const walletOpen = this.props.walletStore.isOpen;

        return (
            <div className="menu-down">
                <ul>
                    {walletOpen ? (
                        <li>
                            <a onClick={this.logout}>
                                <LogoutOutlined />
                                <span>登出钱包</span>
                            </a>
                        </li>
                    ) : null}
                    {/* {this.state.showOut&&this.state.showPass?(
                    <li>
                        <a>
                        <KeyOutlined />
                        <span>修改密码</span>
                        </a>
                    </li>
                    ):null} */}
                    <li>
                        <a>
                            <SettingOutlined />
                            <span>设置</span>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}

export default menuDown;