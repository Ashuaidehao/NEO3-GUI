/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import { message, Modal } from 'antd';
import axios from 'axios';
import Addressdetail from './addressdetail';
import Setting from './setting';
import {
    ReadOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import { shell } from "electron";

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class menuDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "设置",
        };
    }
    componentDidMount() {
    }

    logout = () => {
        const { t } = this.props;
        axios.post('http://localhost:8081', {
            "id": "1234",
            "method": "CloseWallet"
        })
        .then(() => {
            message.success(t("wallet.close wallet success"), 2);
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
        const { t } = this.props;
        return () =>{
            this.setState({showElem: false})
            switch(ele){
                case 0:this.setState({title:t("sideBar.address book"),children: <Addressdetail />});break;
                case 1:this.setState({title:t("sideBar.settings"),children: <Setting />});break;
                default:this.setState({title:t("sideBar.settings"),children: <Setting />});break;
            }
            this.setState({
                visible: true,
            });
        }
    }
    openUrl(url) {
        return () => {
            shell.openExternal(url);
        }
    }
    render() {
        const walletOpen = this.props.walletStore.isOpen;
        const { t } = this.props;
        return (
            <div className="menu-down">
                <ul>
                    {walletOpen ? (
                    <li>
                        <a onClick={this.getInset(0)}>
                            <ReadOutlined />
                            <span>{t("sideBar.address book")}</span>
                        </a>
                    </li>):null}
                    {walletOpen ? (
                    <li>
                        <a onClick={this.logout}>
                            <LogoutOutlined />
                            <span>{t("sideBar.logout")}</span>
                        </a>
                    </li>) : null}
                    <li>
                        <a onClick={this.getInset(1)}>
                            <SettingOutlined />
                            <span>{t("sideBar.settings")}</span>
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