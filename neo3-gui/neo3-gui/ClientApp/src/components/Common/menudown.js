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
import { withTranslation,Trans } from 'react-i18next';
import { shell } from "electron";
import Config from "../../config";
import neonode from "../../neonode";
import { post } from "../../core/request";
import { walletStore } from "../../store/stores";

@withTranslation()
@inject("walletStore")
@inject("blockSyncStore")
@withRouter
@observer
class menuDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "设置",
        };
    }
    componentDidMount() {
        this.setWallet()
    }
    setWallet = () => {
        var _this = this;
        post("ListAddress",{}).then(res =>{
            var _data = res.data;
            console.log(_data)
            console.log("_data")
            if (_data.msgType === -1) {
                // message.error("请先打开钱包");
                return;
            } else {
                _this.props.walletStore.setWalletState(true);
                _this.props.walletStore.setAccounts(_data.result.accounts);
            }
        }).catch(function (error) {
            console.log(error);
            console.log("error");
            // _this.props.history.goBack();
        });
    }
    logout = () => {
        const { t } = this.props;
        axios.post('http://localhost:8081', {
            "id": "1234",
            "method": "CloseWallet"
        }).then(() => {
            message.success(t("wallet.close wallet success"), 2);
            this.props.walletStore.logout();
            this.props.history.push('/');
        }).catch(function (error) {
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
        if (this.state.change) {
            neonode.switchNode(this.state.network);
            axios.post('http://localhost:8081', {
                "id": "1234",
                "method": "CloseWallet"
            }).then(() => {
                this.props.walletStore.logout();
            }).catch(function (error) {
                console.log(error);
            });
            this.props.blockSyncStore.setHeight({ syncHeight: -1, headerHeight: -1 });
            this.props.walletStore.logout();
            this.props.history.push('/');
        }
    };
    getInset = (ele) => {
        const { t } = this.props;
        return () => {
            this.setState({ showElem: false })
            switch (ele) {
                case 0: this.setState({ title: "sideBar.address book", children: <Addressdetail /> }); break;
                case 1: this.setState({ title: "sideBar.settings", children: <Setting switchNetwork={this.switchNetwork.bind(this)} /> }); break;
                default: this.setState({ title: "sideBar.Settings", children: <Setting switchNetwork={this.switchNetwork.bind(this)} /> }); break;
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
    switchNetwork(network) {
        this.setState({
            network: network,
            change: network !== Config.Network
        });
    }
    render() {
        const walletOpen = walletStore.isOpen;
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
                        </li>) : null}
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
                    title={<Trans>{this.state.title}</Trans>}
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