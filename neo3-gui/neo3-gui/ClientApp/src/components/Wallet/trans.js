/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal,List, Button,Typography, message } from 'antd';
import Transaction from '../Transaction/transaction';
import Intitle from '../Common/intitle';


const { Sider, Content } = Layout;

const info = ["GetMyTransactions"];

class Wallettrans extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        translist:[],
    };
  }
  componentDidMount() {
  }
  copyHash = (str) => {
    return ()=>{
      str.select();
      document.execCommand('copy');
      console.log('复制成功');
    }
  }
  render = () =>{
    return (
      <Layout className="wa-container">
        <Transaction info={info} />
      </Layout>
    );
  }
} 

export default Wallettrans;