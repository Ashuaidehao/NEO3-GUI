import React from 'react';
import { Layout } from 'antd';
import Transaction from '../Transaction/transaction';

class Wallettrans extends React.Component{
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
        <Transaction />
      </Layout>
    );
  }
} 

export default Wallettrans;