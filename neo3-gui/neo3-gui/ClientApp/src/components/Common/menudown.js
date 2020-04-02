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
import { withTranslation } from 'react-i18next';
import Config from "../../config";

const { shell } = window.electron;

@withTranslation()
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

    switchLang = (lng) => {
        const { t, i18n } = this.props;
        console.log("current lang:", Config.Language)
        if (Config.Language === lng) {
            return;
        }
        Config.Language = lng;
        i18n.changeLanguage(lng);
    }

    showPass = () => {
        let _path = location.href.search(/wallet/g);
        if (_path <= -1) return;
        this.setState({ showPass: true });
    }
    logout = () => {
        const { t } = this.props;
        var _this = this;
        axios.post('http://localhost:8081', {
            "id": "1234",
            "method": "CloseWallet"
        })
            .then(() => {
                message.success(t("wallet page.close wallet success"), 2);
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
    openUrl(url) {
        return () => {
            shell.openExternal(url);
        }
    }
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
        const { t, i18n } = this.props;
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
                        <li>
                            <a onClick={this.logout}>
                                <LogoutOutlined />
                                <span>{t("button.close wallet")}</span>
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
                            <span>{t("settings")}</span>
                        </a>
                    </li>
                </ul>
                <Modal
                    className="set-modal"
                    title={t("settings")}
                    visible={this.state.visible}
                    onCancel={this.hideModal}
                    footer={null}
                className="set-modal"
                title={this.state.title}
                visible={this.state.visible}
                onCancel={this.hideModal}
                footer={null}
                >
                    <h4>{t("network setting")}</h4>
                    <p>
                        <Radio.Group name="radiogroup" defaultValue={1}>
                            <Radio value={1}>{t("mainnet")}</Radio>
                            <Radio value={2} disabled>{t("testnet")}</Radio>
                        </Radio.Group>
                    </p>

                    <h4 className="mt3">{t("language setting")}</h4>
                    <Radio.Group className="setting-ul" defaultValue={i18n.language}>
                        <Radio value="zh" onClick={(e) => this.switchLang("zh")}>中文</Radio>
                        <Radio value="en" onClick={(e) => this.switchLang("en")}>English</Radio>
                    </Radio.Group>

                    <h4 className="mt3">{t("about")}</h4>
                    {/* <p className="font-s mb5 t-dark">更新完成，请重新启动Neo-GUI</p> */}
                    <p className="font-s">{t("current version")} 1.0.1</p>

                    <p className="mt1 mb3 text-c small">
                        <p className="mb5 t-light">NeoGUI @ 2020 Neo-Project {t("copyright")}</p>
                        <p>
                            {/* <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>查看帮助</a> */}
                            <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>{t("report issues")}</a>
                            <a className="t-green" onClick={this.openUrl("https://neo.org/")}>Neo{t("official website")}</a>
                        </p>
                    </p>
                </Modal>
            </div>
        )
    }
}

export default menuDown;