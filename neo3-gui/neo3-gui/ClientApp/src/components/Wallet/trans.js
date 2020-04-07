import React from 'react';
import { Layout } from 'antd';
import Sync from '../sync';
import Transaction from '../Transaction/transaction';
import Untransaction from '../Transaction/untransaction';
import { withTranslation } from "react-i18next";

@withTranslation()
class Wallettrans extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        translist:[],
    };
  }
  render = () =>{
    const{t}=this.props;
    return (
      <Layout className="gui-container">
        <Sync />
        <Untransaction content={t("transaction page.untrans")} page="wallet"/>
        <Transaction content={t("lastest transactions")} page="wallettrans"/>
      </Layout>
    );
  }
} 

export default Wallettrans;