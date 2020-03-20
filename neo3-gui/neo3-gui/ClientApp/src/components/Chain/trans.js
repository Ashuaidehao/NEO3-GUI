import React from 'react';
import { Layout } from 'antd';
import Transaction from '../Transaction/transaction';
import Sync from '../sync';

class Blocktrans extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
      translist:[],
    };
  }
  render = () =>{
    return (
      <Layout className="gui-container">
        <Sync />
        <Transaction content="最新交易" page="all" />
      </Layout>
    );
  }
} 

export default Blocktrans;