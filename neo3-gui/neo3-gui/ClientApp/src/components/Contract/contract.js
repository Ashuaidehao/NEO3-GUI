/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/contract.css'
import { Layout, Menu, List, Row, Col, PageHeader, Typography,Avatar } from 'antd';
import axios from 'axios';
import Sync from '../sync';
import Searcharea from './searcharea'
import { withTranslation } from "react-i18next";

const { Content } = Layout;

@withTranslation()
class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      visible: false,
      show: false,
      assetlist:[]
    };
  }
  componentDidMount() {
    this.getAllblock();
  }
  visi = () =>{
    this.setState({
      show: !this.state.show,
    });
  }
  show = (e) => {
    return () => {
      console.log(this.state.show)
    }
  }
  getAllblock = (info) => {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1111",
      "method": "GetAllAssets",
      "params": {}
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) {
        message.error("查询失败");
        return;
      }
      _this.setState({
        assetlist: _data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () => {
    const { t } = this.props;
    const { assetlist } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} style={{ 'minHeight': 'calc( 100vh - 135px )' }}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("contract.search contract")}></PageHeader>
              <List
                itemLayout="horizontal"
                dataSource={assetlist}
                className="font-s"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={"https://neo.org/images/gui/"+item.asset+".png"}/>
                      }
                      title={<span>{item.name}</span>}
                    />
                    <Typography>{item.asset}</Typography>
                    <Typography>{item.balance}</Typography>
                  </List.Item>
                )}
              />
            </Col>

          <Searcharea show={this.show()} />
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Contract;