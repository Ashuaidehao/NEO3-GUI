/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, Modal,List, Button,Typography, message } from 'antd';

import { observer, inject } from "mobx-react";

import { withRouter } from "react-router-dom";
import Sync from '../sync';
import { Radio } from 'antd';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import '../../static/css/wallet.css';
import Topath from '../Common/topath';
import { withTranslation } from 'react-i18next';
import Config from "../../config";
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

@withTranslation()
@inject("walletStore")
@observer
@withRouter
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

  switchLang = (lng) => {
      const { t, i18n } = this.props;
      console.log("current lang:", Config.Language)
      if (Config.Language === lng) {
          return;
      }
      Config.Language = lng;
      i18n.changeLanguage(lng);
  }
  openUrl (url) {
    return ()=>{
        shell.openExternal(url);
    }
  }
  render = () =>{
    const { addresslist,address } = this.state;
    const { t, i18n } = this.props;
    return (
      <div>
        <h4>{t("settings.network")}</h4>
        <Radio.Group name="radiogroup" defaultValue={1}>
          <Radio value={1}>{t("settings.mainnet")}</Radio>
          <Radio value={2} disabled>{t("settings.testnet")}</Radio>
        </Radio.Group>

        <h4 className="mt3">{t("settings.language")}</h4>
        <Radio.Group className="setting-ul" defaultValue={i18n.language}>
          <Radio value="zh" onClick={(e) => this.switchLang("zh")}>中文</Radio>
          <Radio value="en" onClick={(e) => this.switchLang("en")}>English</Radio>
        </Radio.Group>

        <h4 className="mt3">{t("settings.about")}</h4>
        <p className="font-s">{t("settings.version")} 1.0.1</p>

        <div className="mt1 mb3 text-c small">
            <p className="mb5 t-light">NeoGUI @ 2020 Neo-Project {t("copyright")}</p>
            <p>
                <a className="mr3 t-green" onClick={this.openUrl("https://github.com/neo-ngd/Neo3-GUI/issues")}>{t("report issues")}</a>
                <a className="t-green" onClick={this.openUrl("https://neo.org/")}>Neo{t("official website")}</a>
            </p>
        </div>
      </div>
    );
  }
} 

export default Setting;