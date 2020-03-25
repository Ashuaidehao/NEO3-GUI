/* eslint-disable */ 
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography } from 'antd';

import Sync from '../components/sync';
import '../static/css/site.css';
import '../static/css/home.css';
import img from '../static/images/logo.svg';
import blockimg from '../static/images/1.svg';
import walletimg from '../static/images/2.svg';
import contractimg from '../static/images/3.svg';
import adavancedimg from '../static/images/4.svg';
import bg from '../static/images/bg.svg';

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
                <div className="pv1 text-c">
                  <img src={img} className="app-logo" alt="img" />
                </div>
              </Content>

              <Content className="home-icon">
                <Row gutter={60}>
                  <Col span={6}>
                    <Link to='/chain'>
                      <div className="home-link">
                        <img src={blockimg} alt="img" />
                        <span>区 块 链</span>
                      </div>
                    </Link>
                  </Col>
                  <Col span={6}>
                    <Link to='/wallet/walletlist'>
                      <div className="home-link">
                        <img src={walletimg} alt="img" />
                        <span>钱 包</span>
                      </div>
                    </Link>
                  </Col>
                  <Col span={6}>
                    <Link to='/contract'>
                      <div className="home-link">
                        <img src={contractimg} alt="img"/>
                        <span>合 约</span>
                      </div>
                    </Link>
                  </Col>
                  <Col span={6}>
                    {/* <Link to='/advanced'>
                      <div className="home-link">
                        <span>高 级</span>
                      </div>
                    </Link> */}
                    <Link to='/pages'>
                      <div className="home-link">
                        <img src={adavancedimg} alt="img"/>
                        <span>高 级</span>
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