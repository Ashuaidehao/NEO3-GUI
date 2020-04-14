/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Input,
  Icon,
  Cascader,
  Modal,
  Select,
  Row,
  Col,
  Form,
  message,
  Menu,
  Button,
  Layout
} from 'antd';
import Sync from '../sync';
import { remote } from 'electron';


const { Content } = Layout;
const { dialog } = remote;


class Loadfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      path: "",
      disabled: false
    };
  }
  toHome = () => {
    location.href = location.origin;
  }
  toPage = (e) => {
  }
  selectNef = () => {
    this.opendialog(res => {
      this.setState({ path: res.filePaths }
        , () => {
          console.log(res)
          console.log(this.state)
        });
    })
  }
  opendialog = callback => {
    var _this = this;
    dialog.showOpenDialog({
      title: '保存钱包文件',
      defaultPath: '/',
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    }).then(function (res) {
      callback(res);
    }).catch(function (error) {
      console.log(error);
    })
  }
  out = fieldsValue => {
    console.log(fieldsValue)
  }
  render = () => {
    const { path } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]}>
            <Col span={24} className="bg-white pv4">
              <Intitle content="部署合约" />
              <div className="w400 mt1 pv1">
                <Form className="trans-form" onFinish={this.out}>
                  <Form.Item
                    name="sender"
                    label="Neo Executable File"
                    value="11111111"
                    onClick={this.selectNef}
                  >
                    <Input placeholder="选择文件" />
                  </Form.Item>
                  {path}
                  {/*             
            <Row>
            <Col span={24}>
                <Input placeholder="选择文件" ref="file" readOnly onClick={this.selectNef} value={this.state.path}/>
                </Col>
            </Row>
            <Row>
            <Col span={24}>
            <Input placeholder="选择文件" ref="file" readOnly onClick={this.selectNef} value={this.state.path}/>
              </Col>
            </Row> */}
                  <a onClick={this.selectNef} >s</a>
                  <div className="text-c lighter"><small>手续费 3 GAS</small></div>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={this.state.iconLoading}>
                      发送
                </Button>
                  </Form.Item>
                </Form>
              </div>

            </Col>
          </Row>

        </Content>
      </Layout>
    );
  }
}

export default Loadfile;