/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, Modal,List, Button,Typography, message } from 'antd';
import Sync from '../sync';
import { Radio } from 'antd';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import '../../static/css/wallet.css';
import Topath from '../Common/topath';
import {
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';

import {
    CloseCircleOutlined 
} from '@ant-design/icons';

const { shell } = window.electron;
const { confirm } = Modal;
const { Content } = Layout;

class Setting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        size: 'default',
        address:"",
        addresslist:[],
        iconLoading:false,
        gas:0,
    };
  }
  componentDidMount() {
  }
  openUrl (url) {
    return ()=>{
        shell.openExternal(url);
    }
  }
  render = () =>{
    const { addresslist,address } = this.state;
    return (
      <div>
        <h4>网络切换</h4>
        <div>
            <Radio.Group name="radiogroup" defaultValue={1}>
                <Radio value={1}>主网</Radio>
                <Radio value={2} disabled>测试网</Radio>
            </Radio.Group>
        </div>

        <h4 className="mt3">语言设置</h4>
        <Radio.Group className="setting-ul" defaultValue={1}>
            <Radio value={1} >中文</Radio>
            <Radio value={2} disabled>English</Radio>
        </Radio.Group>

        <h4 className="mt3">关于</h4>
        {/* <p className="font-s mb5 t-dark">更新完成，请重新启动Neo-GUI</p> */}
        <div className="font-s">当前版本1.0.1</div>
        <div className="mt1 mb3 text-c small">
            <p className="mb5 t-light">NeoGUI @ 2020 Neo-Project 保留所有权利</p>
            <p>
                {/* <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>查看帮助</a> */}
                <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>问题反馈</a>
                <a className="t-green" onClick={this.openUrl("https://neo.org/")}>Neo官网</a>
            </p>
        </div>
      </div>
    );
  }
} 

export default Setting;