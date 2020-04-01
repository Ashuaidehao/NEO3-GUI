/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/menu.css'
import '../../static/css/contract.css'
import { Layout, Menu, Icon, Row, Col, PageHeader, Divider, Drawer, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import MenuDown from '../Common/menudown'
import Sync from '../sync';
import Intitle from '../Common/intitle'
import Searcharea from './searcharea'
import {
  HomeOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { withTranslation } from "react-i18next";



const { Content } = Layout;
const { SubMenu } = Menu;

@withTranslation()
class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      visible: false,
      show: false
    };
  }
  toHome = () => {
  }
  toPage = (e) => {
  }
  visi = () => {
    this.setState({
      show: !this.state.show,
    });
  }
  show = (e) => {
    return () => {
      console.log(this.state.show)
    }
  }
  render = () => {
    const { t } = this.props;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} style={{ 'minHeight': 'calc( 100vh - 135px )' }}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t("contract page.search contract")}></PageHeader>
            </Col>
          </Row>
          <Searcharea show={this.show()} />
        </Content>
      </Layout>
    );
  }
}

export default Contract;