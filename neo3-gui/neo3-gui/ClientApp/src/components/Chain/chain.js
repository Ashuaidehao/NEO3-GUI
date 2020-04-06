/* eslint-disable */
//just test replace wallet//
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, List, Typography, message, Button } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';
import Sync from '../sync'
import { withTranslation } from 'react-i18next';
import Config from "../../config";



const { Content } = Layout;

const count = 3;
@withTranslation()
class Chain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      initLoading: true,
      data: [],
      blocklist: [],
    };
  }
  componentDidMount() {
    this.getBlock(res => {
      this.setState({
        initLoading: false,
        data: res.result,
        blocklist: res.result,
        lastblock: res.result[res.result.length - 1].blockHeight - 1
      }, () => { });
    })
  }
  getBlock = callback => {
    console.log(this.state.lastblock)
    let _params = this.state.lastblock ? {
      "limit": 50,
      "height": this.state.lastblock
    } : {
        "limit": 50
      };
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "GetLastBlocks",
      "params": _params
    })
      .then(function (response) {
        var _data = response.data;
        console.log(_data)
        if (_data.msgType === -1) {
          message.error("查询失败");
          return;
        } else {
          callback(_data);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  };
  loadMore = () => {
    this.setState({
      loading: true,
      blocklist: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getBlock(res => {
      const data = this.state.data.concat(res.result);
      this.setState(
        {
          data,
          blocklist: data,
          loading: false,
          lastblock: data[data.length - 1].blockHeight - 1
        },
        () => {
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  }
  render() {
    const { t } = this.props;
    const { initLoading, loading, blocklist } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div className="text-c mb3">
          <Button type="primary" onClick={this.loadMore}>{t("common.load more")}</Button>
        </div>
      ) : null;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': 'calc( 100vh - 120px )' }}>
            <Col span={24} className="bg-white pv4">
              <Intitle content={t("blockchain.blocks")} />
              <List
                header={<div><span>{t("blockchain.block info")}</span><span className="float-r ml4"><span className="wa-amount">{t("blockchain.transaction count")}</span></span><span className="float-r">{t("blockchain.block time")}</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                loading={initLoading}
                loadMore={loadMore}
                dataSource={blocklist}
                className="font-s"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Link to={"/chain/detail:" + item.blockHeight} title={t("show detail")}>{item.blockHeight}</Link>}
                      description={<div className="font-s">{item.blockHash}</div>}
                    />
                    <Typography>{item.blockTime}</Typography>
                    <Typography className="upcase ml4"><span className="wa-amount">{item.transactionCount}</span></Typography>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          <div className="pv1"></div>
        </Content>
      </Layout>
    );
  }
}

export default Chain;