import React from 'react';
import { Layout } from 'antd';
import Transaction from '../Transaction/transaction';
import Untransaction from '../Transaction/untransaction';
const info = ["GetUnMyTransactions"];

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
        <Untransaction info={info}/>
        <Transaction info={info}/>
      </Layout>
    );
  }
} 

export default Wallettrans;