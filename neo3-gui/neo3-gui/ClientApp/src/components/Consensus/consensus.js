/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/wallet.css'
import {  Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router-dom';
import MenuDown from '../Common/menudown'
import Sync from '../sync';
import {
  HomeOutlined,
  FileSyncOutlined
} from '@ant-design/icons';


const { Sider } = Layout;
const { SubMenu } = Menu;

class Consensus extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default'
    };
  }
  toHome = () =>{
  }
  toPage = (e) =>{
  }
  render = () =>{
    return (
      <Layout>
        <Sync/>

      </Layout>
    );
  }
} 

export default Consensus;