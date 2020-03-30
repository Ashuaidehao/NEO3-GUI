/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import { message } from 'antd';
import { Modal, Button } from 'antd';
import axios from 'axios';
import { Radio } from 'antd';
import {
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
    openUrl (url) {
        return ()=>{
            shell.openExternal(url);
        }
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
                    {/* {walletOpen&&this.state.showPass?(
                    <li>
                        <a>
                        <KeyOutlined />
                        <span>修改密码</span>
                        </a>
                    </li>
                    ):null} */}
                    <li>
                        <a onClick={this.showModal}>
                            <SettingOutlined />
                            <span>设置</span>
                        </a>
                    </li>
                </ul>
                <Modal
                className="set-modal"
                title="设置"
                visible={this.state.visible}
                onCancel={this.hideModal}
                footer={null}
                >
                    <h4>网络切换</h4>
                    <p>
                        <Radio.Group name="radiogroup" defaultValue={1}>
                            <Radio value={1}>主网</Radio>
                            <Radio value={2} disabled>测试网</Radio>
                        </Radio.Group>
                    </p>

                    <h4 className="mt3">语言设置</h4>
                    <Radio.Group className="setting-ul" defaultValue={1}>
                        <Radio value={1} >中文</Radio>
                        <Radio value={2} disabled>English</Radio>
                    </Radio.Group>

                    <h4 className="mt3">关于</h4>
                    {/* <p className="font-s mb5 t-dark">更新完成，请重新启动Neo-GUI</p> */}
                    <p className="font-s">当前版本1.0.1</p>

                    <p className="mt1 mb3 text-c small">
                        <p className="mb5 t-light">NeoGUI @ 2020 Neo-Project 保留所有权利</p>
                        <p>
                            {/* <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>查看帮助</a> */}
                            <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>问题反馈</a>
                            <a className="t-green" onClick={this.openUrl("https://neo.org/")}>Neo官网</a>
                        </p>
                    </p>
                </Modal>
            </div>
        )
    }
}

export default menuDown;