/* eslint-disable */
import React from 'react';
import axios from 'axios';
import {
  Alert, Input,
  Form,
  InputNumber,
  Modal,
  Select,
  Row,
  Col,
  message,
  Button,
  AutoComplete,
} from 'antd';
import { Layout } from 'antd';
import '../../static/css/wallet.css'
import { withTranslation } from "react-i18next";

const { Option } = Select;
const { Content } = Layout;

@withTranslation()
class Multitrans extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          iconLoading: false
        };
      }
    render = () =>{
        const {account} = this.props;
        const { t } = this.props;
        console.log(account);
        return (
        <div className="info-detail">
        <Form ref="formRef" className="trans-form" onFinish={this.transfer}>
            <Row gutter={[30, 0]} className="bg-white pv4" style={{ 'minHeight': 'calc( 100vh - 150px )' }}>
                <Col span={24}>
                <div className="w400 mt2" style={{ 'minHeight': 'calc( 100vh - 350px )' }}>
                    <Form.Item
                    name="sender"
                    label={t("wallet.from")}
                    rules={[
                        {
                        required: true,
                        message: t("wallet.please select a account"),
                        },
                    ]}
                    >
                    <Select
                        placeholder={t("select account")}
                        style={{ width: '100%' }}
                        onChange={this.setAddress}>
                        {account.map((item, index) => {
                        return (
                            <Option key={index}>{item.address}</Option>
                        )
                        })}
                    </Select>
                    </Form.Item>
                    <Form.Item
                    name="receiver"
                    label={t("wallet.to")}
                    rules={[
                        {
                        required: true,
                        message: t("wallet.please input a account"),
                        },
                    ]}
                    >
                    <Input placeholder={t("input account")} />
                    </Form.Item>
                    <Row>
                    <Col span={15}>
                        <Form.Item
                        name="amount"
                        label={t("wallet.amount")}
                        rules={[
                            {
                            required: true,
                            message: t("wallet.please input a correct amount"),
                            },
                        ]}>
                        <InputNumber min={0} step={1} placeholder={t("wallet.amount")} />
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item
                        name="asset"
                        label={t("wallet.asset")}
                        rules={[
                            {
                            required: true,
                            message: t("wallet.required"),
                            },
                        ]}>
                        <Select
                            placeholder={t("wallet.select")}
                            style={{ width: '100%' }}
                        >
                            {account.map((item, index) => {
                            return (
                                <Option key={index} value={item.asset} title={item.symbol}><span className="trans-symbol">{item.symbol} </span><small>{item.balance}</small></Option>
                            )
                            })}
                        </Select>
                        </Form.Item>
                    </Col>
                    </Row>
                    <div className="text-c lighter">
                        <small>{t("wallet.estimated time")}：12s </small>
                    </div>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" loading={this.state.iconLoading}>
                        {t("button.send")}
                    </Button>
                    </Form.Item>
                </div>
                <Alert
                    className="mt2 mb4"
                    showIcon
                    type="info"
                    message={t("wallet.transfer warning")}
                />
                </Col>
            </Row>
        </Form>
        </div>
        );
    }
} 

export default Multitrans;