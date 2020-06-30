import React from 'react';
import { observer, inject } from "mobx-react";
import Wallet from '../components/Wallet/wallet';
import { walletStore } from "../store/stores";

function Authenticated(Component) {
    // 组件有已登陆的模块 直接返回 (防止重新渲染)
    // 创建验证组件
    if (Component.AuthenticatedComponent) {
        return Component.AuthenticatedComponent
    }
    
    @inject("walletStore")
    @observer
    class AuthenticatedComponent extends React.Component {
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