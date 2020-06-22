import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, List, Typography, message,PageHeader,Avatar } from 'antd';
import Sync from '../sync';
import { withTranslation } from 'react-i18next';
import { post } from "../../core/request";
import "../../static/css/chain.css";

const { Content } = Layout;
@withTranslation()
class Chainasset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetlist: [],
    };
  }
  componentDidMount() {
    this.getAllblock();
  }
  getAllblock = (info) => {
    var _this = this;
    const { t } = this.props;
    post("GetAllAssets",{}).then(res =>{
      var _data = res.data;
      if (_data.msgType === -1) {
        message.error("查询失败");
        return;
      }
      _this.setState({
        assetlist: _data.result
      })
    }).catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render() {
    const { t } = this.props;
    const { assetlist } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt2 mb1">
          <Row gutter={[30, 0]} style={{ 'minHeight': 'calc( 100vh - 120px )' }}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("blockchain.assets")}></PageHeader>
              <div>
                <List
                  header={<div><span>{t("blockchain.asset info")}</span><span className="float-r w-time ml3">{t("blockchain.initial time")}</span><span className="float-r">{t("blockchain.total")}</span></div>}
                  itemLayout="horizontal"
                  dataSource={assetlist}
                  className="font-s"
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar src={"https://neo.org/images/gui/"+item.asset+".png"}/>
                        }
                        title={<Link className="asset-link w500 ellipsis" to={"/chain/asset:" + item.asset} title={t("show detail")}><span className="w-symbol mr3">{item.symbol}</span>{item.asset}</Link>}
                      />
                      <Typography className="w-total">{item.totalSupply?item.totalSupply:"--"}</Typography>
                      <Typography className="w-time ml3">{(item.createTime).substr(0,10)}</Typography>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
            <div className="pv1"></div>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Chainasset;