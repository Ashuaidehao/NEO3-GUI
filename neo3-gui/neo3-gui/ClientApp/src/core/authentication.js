/* eslint-disable */
import React from 'react';
import {BrowserRouter, Route, Switch,Redirect} from 'react-router-dom';
import { message } from 'antd';
import { observer, inject } from "mobx-react";
import Wallet from '../components/Wallet/wallet';
import { walletStore } from "../store/stores";
import { post } from "../core/request";

function Authenticated(Component) {
    // 组件有已登陆的模块 直接返回 (防止重新渲染)
    // 创建验证组件
    if (Component.AuthenticatedComponent) {
        return Component.AuthenticatedComponent
    }
    
    @inject("walletStore")
    @observer
    class AuthenticatedComponent extends React.Component {
        componentDidMount() {
            this.getGas()
          }
        getGas = () => {
            post("OpenWallet",{}).then(res =>{
                var _data = res.data;
                console.log(_data)
                if (_data.msgType === -1) {
                    message.error("请先打开钱包");
                    return;
                } else {
                }
            }).catch(function (error) {
                console.log(error);
                console.log("error");
                // _this.props.history.goBack();
            });
        }
        render() {
            const walletOpen = this.props.walletStore.isOpen;
            return (
                <div style={{ width: '100%'}}>
                    {walletOpen ? <Component {...this.props}/> : <Wallet/>}
                </div>
            )
        }
    }

    Component.AuthenticatedComponent = AuthenticatedComponent
    return Component.AuthenticatedComponent
}


export { Authenticated }
// export default Authenticated;