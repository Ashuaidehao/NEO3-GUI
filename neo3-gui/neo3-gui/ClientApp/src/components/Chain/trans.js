import React from 'react';
import { Layout } from 'antd';
import Transaction from '../Transaction/transaction';
import Sync from '../sync';
import { withTranslation } from 'react-i18next';

@withTranslation()
class Blocktrans extends React.Component{
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
        <Transaction content={t("blockchain.transactions")} page="all" />
      </Layout>
    );
  }
} 

export default Blocktrans;