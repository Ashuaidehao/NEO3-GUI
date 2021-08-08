/* eslint-disable */
//just test replace wallet//
import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, message, List, PageHeader } from "antd";
import axios from "axios";
import Intitle from "../Common/intitle";
import Transaction from "../Transaction/transaction";
import Sync from "../sync";
import { withTranslation } from "react-i18next";
import { post } from "../../core/request";

const { Content } = Layout;

@withTranslation()
class Assetdetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetdetail: {},
      height: 0,
      witness: "",
      nonce: 0,
    };
  }
  componentDidMount() {
    this.getAsset((res) => {
      console.log(res);
      this.setState({
        assetdetail: res,
      });
    });
  }
  getAsset = (callback) => {
    var _this = this;
    let params = {
      asset: location.pathname.split(":").pop(),
    };
    post("GetAsset", params)
      .then((res) => {
        var _data = res.data;

        if (_data.msgType === -1) {
          message.error("查询失败");
          return;
        } else {
          callback(_data.result);
        }
      })
      .catch(function (error) {
        console.log("error");
      });
  };
  setHash = (h) => {
    return () => {
      this.setState(
        {
          hash: h,
        },
        () => this.getAsset()
      );
    };
  };
  render() {
    const { assetdetail } = this.state;
    const { t } = this.props;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex">
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("blockchain.asset detail")}></PageHeader>
              <div className="info-detail pv3">
                <div className="hash-title pa3 mt5 mb4">
                  <span>Hash: &nbsp;&nbsp;&nbsp;</span>
                  {assetdetail.asset}
                </div>
                {assetdetail.asset ? (
                  <Row>
                    <Col span={12}>
                      <ul className="detail-ul">
                        <li>
                          <span className="hint">{t("blockchain.name")}:</span>
                          {assetdetail.name}
                        </li>
                        <li>
                          <span className="hint">
                            {t("blockchain.total")}：
                          </span>
                          {assetdetail.totalSupply
                            ? assetdetail.totalSupply
                            : "--"}
                        </li>
                        <li>
                          <span className="hint">
                            {t("blockchain.publish time")}：
                          </span>
                          {assetdetail.createTime.substr(0, 10)}
                        </li>
                      </ul>
                    </Col>
                    <Col span={12}>
                      <ul className="detail-ul">
                        <li>
                          <span className="hint">
                            {t("blockchain.abbreviation")}：
                          </span>
                          {assetdetail.symbol}
                        </li>
                        <li>
                          <span className="hint">
                            {t("blockchain.precision")}：
                          </span>
                          {assetdetail.decimals ? assetdetail.decimals : "0"}
                        </li>
                        <li>
                          <span className="hint">
                            {t("blockchain.transaction count")}：
                          </span>
                          {assetdetail.transactionCount
                            ? assetdetail.transactionCount
                            : "--"}
                        </li>
                      </ul>
                    </Col>
                  </Row>
                ) : null}
              </div>
            </Col>
          </Row>

          <Row
            gutter={[30, 0]}
            className="mt2 mb1"
            type="flex"
            style={{ minHeight: "120px" }}
          >
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("blockchain.transactions")}></PageHeader>
              <Transaction
                content={t("blockchain.transactions")}
                page="assetdetail"
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Assetdetail;
