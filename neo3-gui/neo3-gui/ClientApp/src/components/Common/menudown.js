/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import { message } from 'antd';
import { Modal, Button } from 'antd';
import axios from 'axios';
import { Radio } from 'antd';
import Addressdetail from './addressdetail';
import Setting from './setting';
import {
    ReadOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';

const { shell } = window.electron;

@inject("walletStore")
@observer
@withRouter
class menuDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPass: false,
            title:"设置",
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
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    getInset = (ele) => {
        return () =>{
            this.setState({showElem: false})
            switch(ele){
                case 0:this.setState({title:"地址簿",children: <Addressdetail />});break;
                case 1:this.setState({title:"设置",children: <Setting />});break;
                default:this.setState({title:"设置",children: <Setting />});break;
            }
            this.setState({
                visible: true,
            });
        }
    }
    render() {
        const walletOpen = this.props.walletStore.isOpen;
        return (
            <div className="menu-down">
                <ul>
                    {walletOpen ? (
                    <li>
                        <a onClick={this.getInset(0)}>
                            <ReadOutlined />
                            <span>地址簿</span>
                        </a>
                    </li>):null}
                    {walletOpen ? (
                    <li>
                        <a onClick={this.logout}>
                            <LogoutOutlined />
                            <span>登出钱包</span>
                        </a>
                    </li>
                    ) : null}
                    {/* {walletOpen&&this.state.showPass?(
                    <li>
                        <a>
                        <KeyOutlined />
                        <span>修改密码</span>
                        </a>
                    </li>
                    ):null} */}
                    <li>
                        <a onClick={this.getInset(1)}>
                            <SettingOutlined />
                            <span>设置</span>
                        </a>
                    </li>
                </ul>
                <Modal
                className="set-modal"
                title={this.state.title}
                visible={this.state.visible}
                onCancel={this.hideModal}
                footer={null}
                >
                    {this.state.children}
                </Modal>

            </div>
        )
    }
}

export default menuDown;