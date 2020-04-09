/* eslint-disable */
import React from 'react';
import axios from 'axios';
import '../../static/css/trans.css';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Tabs, message, PageHeader, Divider } from 'antd';
import Translog from './translog';
import Datatrans from '../Common/datatrans';
import Sync from '../sync';
import { SwapOutlined } from '@ant-design/icons';
import { useTranslation, withTranslation } from "react-i18next";

const { Content } = Layout;

const { TabPane } = Tabs;
@withTranslation()
class Transcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      visible: false,
      hashdetail: [],
      transfers: [],
      witnesses: [],
      attributes: [],
      notifies: []
    };
  }
  componentDidMount() {
    this.getTransdetail(res => {
      this.setState({
        hashdetail: res,
        transfers: res.transfers,
        witnesses: res.witnesses,
        attributes: res.attributes,
        notifies: res.notifies,
      });
    });
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  getTransdetail = callback => {
    let _hash = location.pathname.split(":").pop();
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "GetTransaction",
      "params": {
        "txId": _hash
      }
    })
      .then(function (response) {
        var _data = response.data;
        console.log(_data)
        if (_data.msgType === -1) {
          message.error("查询失败");
          console.log(_data);
          return;
        } else {
          callback(_data.result);
        }
        console.log(_data)
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  render = () => {
    const { t } = this.props;
    const { hashdetail, transfers, witnesses, attributes } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} className="mb1">
            <Col span={24} className="bg-white pv4">
              <a className="fix-btn" onClick={this.showDrawer}><SwapOutlined /></a>
              <Tabs className="tran-title" defaultActiveKey="1">
                <TabPane tab={t("blockchain.transaction.content")} key="1">
                  <Detail hashdetail={hashdetail} />
                  <Translist transfers={transfers} />
                  <Attrlist attributes={attributes} />
                  <Witlist witnesses={witnesses} />
                </TabPane>
                <TabPane tab={t("blockchain.transaction.log")} key="2">
                  <Translog notifies={this.state.notifies} />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <Datatrans visible={this.state.visible} onClose={this.onClose} />
        </Content>
      </Layout>
    );
  }
}

export default Transcon;


const Detail = ({ hashdetail }) => {
  const { t } = useTranslation();
  return (
    <Row>
      <div className="hash-title pa3"><span>Hash: &nbsp;&nbsp;&nbsp;</span>{hashdetail.txId}</div>
      {console.log(hashdetail)}
      <Col span={12}>
        <ul className="detail-ul">
          <li><span className="hint">{t("blockchain.block")}：</span><Link to={"/chain/detail:" + hashdetail.blockHeight}>{hashdetail.blockHeight}</Link></li>
          <li><span className="hint">{t("blockchain.timestamp")}：</span>{hashdetail.timestamp}</li>
          <li><span className="hint">{t("blockchain.network fee")}：</span>{hashdetail.networkFee ? hashdetail.networkFee : '--'} GAS</li>
          <li><span className="hint">{t("blockchain.confirmations")}：</span>{hashdetail.confirmations}</li>
        </ul>
      </Col>
      <Col span={12}>
        <ul className="detail-ul">
          <li><span className="hint">{t("common.size")}：</span>{hashdetail.size} {t("common.bytes")}</li>
          <li><span className="hint">{t("common.time")}：</span>{hashdetail.blockTime}</li>
          <li><span className="hint">{t("blockchain.system fee")}：</span>{hashdetail.systemFee} GAS</li>
          <li><span className="hint">{t("blockchain.nounce")}：</span>{hashdetail.nonce}</li>
        </ul>
      </Col>
      <div className="hash-title pv3"></div>
      <Divider></Divider>
    </Row>
  )
};
const Translist = ({ transfers }) => {
  const { t } = useTranslation();
  return (
    <div>
    {transfers.length > 0 ? (
    <Row>
      <Col span={24}>
        <div className="hash-title pa3 mt4 mb3">{t("blockchain.transaction.transfers")}</div>
        {transfers.map((item, index) => {
          return (
            <ul className="detail-ul border-under" key={index}>
              <li><span className="gray">{t("blockchain.transaction.from")}</span><span className="detail-add">{item.fromAddress ? item.fromAddress : "--"}</span></li>
              <li><span className="gray">{t("blockchain.transaction.to")}</span><span className="detail-add">{item.toAddress ? item.toAddress : "--"}</span></li>
              <li><span className="gray">{t("blockchain.transaction.amount")}</span><span className="detail-amount">{item.amount} {item.symbol}</span></li>
            </ul>
          )
        })}
      </Col>
    </Row>
    ):null}
    </div>
  )
};
const Attrlist = ({ attributes }) => {
  const { t } = useTranslation();
  return (
    <div>
      {attributes.length > 0 ? (
        <Row>
          <Col span={24}>
            <div className="hash-title pa3 mt5 mb4">{t("blockchain.transaction.attributes")}</div>
            <ul className="detail-ul">
              {attributes.map((item, index) => {
                return (
                  <li key={index}>
                    <p>Url</p>
                    <p className="trans-table">
                      <span><span className="trans-type">{item.type ? item.type : "--"}</span></span>
                      <span>{item.data ? item.data : "--"}</span>
                    </p>
                  </li>
                )
              })}
            </ul>
          </Col>
          <Divider></Divider>
        </Row>
      ) : null}
    </div>
  )
};
const Witlist = ({ witnesses }) => {
  const { t } = useTranslation();

  return (
    <Row>
      <Col span={24}>
        <div className="hash-title pa3 mt4 mb4">{t("blockchain.witness")}</div>
        {witnesses.map((item, index) => {
          return (
            <ul className="detail-ul border-under" key={index}>
              <li>
                <p>{t("blockchain.transaction.invocation script")}</p>
                <p className="trans-table">
                  <span><span className="trans-type">HEX</span></span>
                  <span>{item.invocationScript}</span>
                </p>
              </li>
              <li>
                <p>{t("blockchain.transaction.verification script")}</p>
                <p className="trans-table">
                  <span><span className="trans-type">HEX</span></span>
                  <span>{item.verificationScript}</span>
                </p>
              </li>
            </ul>
          )
        })}
      </Col>
    </Row>
  )
};