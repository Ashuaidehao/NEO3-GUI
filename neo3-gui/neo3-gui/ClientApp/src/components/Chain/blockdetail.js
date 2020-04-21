/* eslint-disable */
//just test replace wallet//
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, message, PageHeader, Typography } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import Sync from '../sync';
import { withTranslation } from 'react-i18next';


const { Content } = Layout;

@withTranslation()
class Blockdetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockdetail: {},
      height: 0,
      nonce: 0,
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
      this.setState({height: h},() => this.getAllblock(res =>{
        this.setState({
          blockdetail: res.result,
          witness: res.result.witness.scriptHash,
          nonce: res.result.consensusData.nonce,
          translist: res.result.transactions
        })
      })
      );
    }
  }
  render() {
    const { t } = this.props;
    const { blockdetail, nonce } = this.state;
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
                      <li><span className="hint">{t("blockchain.system fee")}：</span>{blockdetail.networkFee ? blockdetail.networkFee : '--'}</li>
                      <li><span className="hint">{t("blockchain.witness")}：</span>{blockdetail.nextConsensus}</li>
                      <li><span className="hint">{t("blockchain.next block")}：</span><Link to={"/chain/detail:" + (blockdetail.blockHeight + 1)} onClick={this.setHeight(blockdetail.blockHeight + 1)}>{blockdetail.blockHeight + 1}</Link></li>
                    </ul>
                  </Col>
                </Row>:null}
              </div>
            </Col>
          </Row>
          <Transaction page="blockdetail" content={t("blockchain.transactions")} />
        </Content>
      </Layout>
    );
  }
}

export default Blockdetail;