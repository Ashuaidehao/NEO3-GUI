/* eslint-disable */
//just test replace wallet//
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, message, PageHeader, List } from 'antd';
import axios from 'axios';
import Sync from '../sync';
import { withTranslation } from 'react-i18next';

import { SwapRightOutlined } from '@ant-design/icons';


const { Content } = Layout;

@withTranslation()
class Blockdetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockdetail: {},
      height: 0,
      nonce: 0,
      translist:[]
    };
  }
  componentDidMount() {
    let _h = Number(location.pathname.split(":").pop())
    this.setHeight(_h)();
    this.setState({
      local: location.pathname
    })
  }
  getAllblock = callback => {
    const { t } = this.props;
    let _height = this.state.height;
    axios.post('http://localhost:8081', {
      "id": "1111",
      "method": "GetBlock",
      "params": {
        "index": _height
      }
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) {
        message.info(t('blockchain.height unexist'));
        return;
      }else{
        callback(_data);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  setHeight = (h) => {
    return () => {
      this.setState({height: h},
        () => this.getAllblock(res =>{
          this.setState({
            blockdetail: res.result,
            witness: res.result.witness.scriptHash,
            nonce: res.result.consensusData.nonce,
            height: res.result.blockHeight
          },()=>{this.getBlocktrans()})
        })
      );
      
    }
  }
  getBlocktrans = () =>{
    const { t } = this.props;
    let _height = this.state.height;
    let _this = this;
    axios.post('http://localhost:8081', {
      "id": "1111",
      "method": "QueryTransactions",
      "params": {
        "blockHeight":_height,
        "limit":100
      }
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) {
        message.info(t('blockchain.height unexist'));
        return;
      }else{
        _this.setState({translist:_data.result.list})
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render() {
    const { t } = this.props;
    const { blockdetail, nonce, height,translist } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex">
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("blockchain.block info")}></PageHeader>
              <div className="info-detail pv3">
                <div className="hash-title pa3 mt5 mb4"><span>Hash: &nbsp;&nbsp;&nbsp;</span>{blockdetail.blockHash}</div>
                {blockdetail.blockHash?
                <Row>
                  <Col span={12}>
                    <ul className="detail-ul">
                      <li><span className="hint">{t("blockchain.height")}:</span>{blockdetail.blockHeight}</li>
                      <li><span className="hint">{t("blockchain.timestamp")}：</span>{blockdetail.blockTime}</li>
                      <li><span className="hint">{t("blockchain.network fee")}：</span>{blockdetail.networkFee ? blockdetail.networkFee : '--'}</li>
                      <li><span className="hint">{t("blockchain.confirmations")}：</span>{blockdetail.confirmations}</li>
                      {blockdetail.blockHeight !== 0?
                      <li><span className="hint">{t("blockchain.prev block")}：</span><Link to={"/chain/detail:" + (blockdetail.blockHeight - 1)} onClick={this.setHeight(blockdetail.blockHeight - 1)}>{blockdetail.blockHeight - 1}</Link></li>
                      :<li><span className="hint">{t("blockchain.prev block")}：</span>--</li>}
                    </ul>
                  </Col>
                  <Col span={12}>
                    <ul className="detail-ul">
                      <li><span className="hint">{t("common.size")}：</span>{blockdetail.size} {t("common.bytes")}</li>
                      <li><span className="hint">{t("blockchain.nounce")}：</span>{nonce}</li>
                      <li><span className="hint">{t("blockchain.system fee")}：</span>{blockdetail.systemFee ? blockdetail.systemFee : '--'}</li>
                      <li><span className="hint">{t("blockchain.witness")}：</span>{blockdetail.nextConsensus}</li>
                      <li><span className="hint">{t("blockchain.next block")}：</span><Link to={"/chain/detail:" + (blockdetail.blockHeight + 1)} onClick={this.setHeight(blockdetail.blockHeight + 1)}>{blockdetail.blockHeight + 1}</Link></li>
                    </ul>
                  </Col>
                </Row>:null}
              </div>
            </Col>
          </Row>

          {/* <Transaction page={this.state.href} content={t("blockchain.transactions")} /> */}

          <Row gutter={[30, 0]} className="mt2 mb2" type="flex" style={{ 'minHeight': '120px' }}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("blockchain.transactions")}></PageHeader>
              <List
                header={<div><span className="succes-light">{t("blockchain.transaction.status")}</span><span>{t("blockchain.transaction info")}</span><span className="float-r">{t("common.time")}</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                dataSource={translist}
                className="font-s"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                    title={<span className="succes-light">{t('blockchain.transaction.confirmed')}</span>}
                    />
                    <div className="trans-detail">
                        <p>
                          <Link className="w500 ellipsis hash" to={ "/chain/transaction:" + item.txId} title={t("show detail")}>{item.txId}</Link>
                          <span className="float-r">{item.blockTime}</span>
                        </p>
                        {item.transfers[0]?
                        <div >
                          <span className="w200 ellipsis">{item.transfers[0].fromAddress ? item.transfers[0].fromAddress : "--"}</span>
                          <SwapRightOutlined />
                          <span className="w200 ellipsis" >{item.transfers[0].toAddress ? item.transfers[0].toAddress : "--"}</span>
                          <span className="float-r"><span className="trans-amount">{item.transfers[0].amount}</span>{item.transfers[0].symbol}</span>
                        </div>
                        :null}
                    </div>
                  </List.Item>
                )}
              />
            </Col>
            <div className="pv1"></div>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Blockdetail;