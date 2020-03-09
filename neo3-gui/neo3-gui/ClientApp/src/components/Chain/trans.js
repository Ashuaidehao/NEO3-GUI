import React from 'react';
import { Layout } from 'antd';
import Transaction from '../Transaction/transaction';

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
        <Transaction content="全部交易"/>
      </Layout>
    );
  }
} 

export default Blocktrans;