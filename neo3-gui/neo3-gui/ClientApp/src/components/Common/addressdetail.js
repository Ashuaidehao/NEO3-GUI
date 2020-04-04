/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import axios from 'axios';

import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import {Link} from 'react-router-dom';
import { Layout, Row, Col, Modal,List, Button,Typography, message } from 'antd';
import Sync from '../sync';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import '../../static/css/wallet.css';
import Topath from '../Common/topath';
import { withTranslation } from 'react-i18next';
import {
  CloseCircleOutlined 
} from '@ant-design/icons';

const { confirm } = Modal;
const { Content } = Layout;

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Addressdetail extends React.Component{
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
  render = () =>{
    const accounts = this.props.walletStore.accountlist;
    const { t } = this.props;
    return (
      <div>
        <h4>{t("sideBar.address book")}</h4>
        <ul className="add-mark">
        {accounts.map((item,index)=>{
          return(
            <li key={index}>
              {item.address} <span className="float-r mr2 small">NEO {item.neo}</span>
              {/* <span className="mr2 small">NEO {item.neo}</span>
              <span className="small">GAS {item.gas}</span> */}
            </li>
          )
        })}
        </ul>
        <div className="mt1 mb3 text-c small">
            <p className="mb5 t-light">NeoGUI @ 2020 Neo-Project {t("copyright")}</p>
        </div>
      </div>
    );
  }
} 

export default Addressdetail;