import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Modal } from 'antd';
import Sync from './components/sync';
import Walletopen from './components/Wallet/open';
import './static/css/site.css';
import img from './static/images/globe.png';
import blc from './static/images/blockchain.svg';

const { Text } = Typography;
const { Content, Footer } = Layout;

class App extends React.Component {
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
        <Layout>
          <Content>
            <img src={img} className="App-logo" alt="img" />
            <Sync></Sync>
            <Content className="text-r">
              <p>
                <Text type="secondary"> 版本 v3.0.1</Text>
              </p>
            </Content>
          </Content>
          <Content className="home-icon">
            <Row>
              <Col span={6}>
                <Link to='/chain'>
                  <img src={blc} alt="blc" /><br />
                  <span>区块链</span>
                </Link>
              </Col>
              <Col span={6}>
                <Link to='/wallet'>
                  <img src={blc} alt="blc" /><br />
                  <span>钱包</span>
                </Link>
                {/* <Button type="primary" onClick={this.showModal}>
                  Open Modal with async logic
                </Button> */}
              </Col>
              <Col span={6}>
                <Link to='/consensus'>
                  <img src={blc} alt="blc" /><br />
                  <span>合约</span>
                </Link>
              </Col>
              <Col span={6}>
                <Link to='/advanced'>
                  <img src={blc} alt="blc" /><br />
                  <span>高级</span>
                </Link>
              </Col>
            </Row>
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center', color: '#CCCCCC' }}>Copyright © Neo Team 2014-2019</Footer>
        <Modal
          title="Title"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{ModalText}</p>
          <Walletopen />
        </Modal>
      </div>
    );
  }
}

export default App;
