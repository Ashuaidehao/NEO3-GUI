import React from "react";
import { Layout, Row, Col, Tabs } from "antd";
import Transaction from "../Transaction/transaction";
import Untransaction from "../Transaction/untransaction";
import Sync from "../sync";
import { withTranslation } from "react-i18next";

import { ArrowLeftOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { TabPane } = Tabs;

@withTranslation()
class Wallettrans extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "default",
      translist: [],
    };
  }
  render = () => {
    const { t } = this.props;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} className="mb1">
            <Col span={24} className="bg-white pv4">
              <Tabs
                className="tran-title trans-list-title"
                defaultActiveKey="1"
              // tabBarExtraContent={<Searchtttt />}
              // <ArrowLeftOutlined className="h2" onClick={this.back}/>}
              >
                <TabPane tab={t("blockchain.transactions")} key="1">
                  <Transaction page="wallettrans" />
                </TabPane>
                <TabPane tab={t("blockchain.transaction.pending")} key="2">
                  <Untransaction page="wallet" />
                </TabPane>
              </Tabs>
              {/* <Searcharea /> */}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  };
}

export default Wallettrans;
