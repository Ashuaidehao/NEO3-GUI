/* eslint-disable */ 
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography } from 'antd';

import Sync from '../components/sync';
import '../static/css/site.css';
import '../static/css/home.css';
import img from '../static/images/logo.svg';

const { Text } = Typography;
const { Content } = Layout;

class Home extends Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });

        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 1000);
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        return (
          <div>
            <Layout className="home-content">
              <Content>
                <Sync></Sync>
                <div className="w600 text-c">
                  <img src={img} className="App-logo" alt="img" />
                </div>
                <Content className="text-r">
                  <Text type="secondary"> 版本 v3.0.1</Text>
                </Content>
              </Content>

              <Content className="home-icon">
                <Row gutter={32}>
                  <Col span={6}>
                    <Link to='/chain'>
                      <div className="home-link">
                        <span>区块链</span>
                      </div>
                    </Link>
                  </Col>
                  <Col span={6}>
                    <Link to='/wallet'>
                      <div className="home-link">
                        <span>钱包</span>
                      </div>
                    </Link>
                  </Col>
                  <Col span={6}>
                    <Link to='/pages'>
                      <div className="home-link">
                        <span>合约</span>
                      </div>
                    </Link>
                  </Col>
                  <Col span={6}>
                    <Link to='/advanced'>
                      <div className="home-link">
                        <span>高级</span>
                      </div>
                    </Link>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </div>
        );
      }
}

export default Home;