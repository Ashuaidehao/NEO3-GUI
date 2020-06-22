/* eslint-disable */
import React, { useState, useEffect, useRef,useContext } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import { Layout, Row, Col, Tabs, message, PageHeader,Modal } from 'antd';
import { walletStore } from "../../store/stores";
import { withRouter } from "react-router-dom";
import Sync from '../sync';
import "../../static/css/advanced.css";
import { SwapOutlined, PaperClipOutlined } from '@ant-design/icons';
import { withTranslation, useTranslation } from "react-i18next";
import { Trans } from 'react-i18next';
import { post } from "../../core/request";


const { Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;

function success(data) {
    Modal.success({
        title: <Trans>签名成功</Trans>,
        content: (
            <div className="show-pri">
            <p><Trans>blockchain.transaction hash</Trans>：{data.result}</p>
            </div>
        ),
        okText:"确认"
    });
}

function error(data) {
    Modal.error({
        title: <Trans>wallet.transfer send error</Trans>,
        width: 400,
        content: (
          <div className="show-pri">
            <p><Trans>blockchain.transaction hash</Trans>: {data.error.code}</p>
            <p><Trans>error msg</Trans>: {data.error.message}</p>
          </div>
        ),
        okText:<Trans>确认</Trans>
    });
}

const Signtrans = () =>{
    const { t } = useTranslation();
    const [broad,changeBroad] = useState("");
    const onSign  = values => {
        let params = {signContext:values.sign};
        post("AppendSignature",params).then(res =>{
            var _data = res.data;
            if(_data.msgType === -1){
                error(_data);
                changeBroad(values.sign)
            }else if(_data.msgType === 3){
                success(_data);
                changeBroad(_data.result)
            }
        })
    };
    const onBroad = values =>{
        let params = {signContext:values.broadcast};
        post("BroadcastTransaction",params).then(res =>{
            var _data = res.data;
            if(_data.msgType === -1){
                error(_data);
            }else if(_data.msgType === 3){
                success(_data);
            }
        })
    }
    return (
        <div>
            <Form
                name="form"
                onFinish={onSign}
            >
                <h4>交易json</h4>
                <Form.Item
                    name="sign"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your json!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        签名
                    </Button>
                </Form.Item>
            </Form>
            <Form
                name="form"
                onFinish={onBroad}
            >
                <div>{broad}</div>
                <h4>签名结果</h4>
                <Form.Item
                    name="broadcast"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your json!',
                        },
                    ]}
                >
                    <TextArea/>
                </Form.Item>
        
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        广播交易
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

@withTranslation()
class Advancedsignature extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            signres: ""
        };
    }
    render() {
        const { t } = this.props;
        return (
            <Layout className="gui-container">
            <Sync />
            <Content className="mt3">
              <Row gutter={[30, 0]} className="mb1" style={{ 'minHeight': 'calc( 100vh - 150px )' }}>
                <Col span={24} className="bg-white pv4">
                  <a className="fix-btn" onClick={this.showDrawer}><SwapOutlined /></a>
                  <Tabs className="tran-title" defaultActiveKey="1">
                    {/* <TabPane tab={t("文本签名")} key="1">
                      <div>文本签名</div>
                    </TabPane> */}
                    <TabPane tab={t("交易签名")} key="2">
                      <Signtrans/>
                    </TabPane>
                    <TabPane tab={t("验证签名")} key="3">
                      <div>验证签名</div>
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </Content>
          </Layout>
        );
    }
}
    

// export { Advancedsignature }
export default Advancedsignature;


