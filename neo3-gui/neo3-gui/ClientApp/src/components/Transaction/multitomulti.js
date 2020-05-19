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
class Multitonmulti extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        iconLoading: false,
        selectadd:[]
      };
    }
    setAddress = target => {
      target = target ? target : 0;
      let _detail = this.props.account[target].balances;
      this.setState({
        selectadd: _detail
      })
    }
    render = () =>{
        const {account} = this.props;
        const {selectadd} = this.state;
        const { t } = this.props;
        return (
        <Form ref="formRef" className="trans-form" onFinish={this.transfer}>
            <Row gutter={[30, 0]} className="bg-white pv4">
                <Col span={24}>
                <div className="w500 mt3" style={{ 'minHeight': 'calc( 100vh - 350px )' }}>
                    <Row>
                      <Col span={15}>
                      <Form.Item
                        name="sender"
                        label={t("付款账户")}
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
                              {selectadd.map((item, index) => {
                              return (
                                  <Option key={index} value={item.asset} title={item.symbol}><span className="trans-symbol">{item.symbol} </span><small>{item.balance}</small></Option>
                              )
                              })}
                          </Select>
                          </Form.Item>
                      </Col>
                    </Row>
                    
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
                    <Input.TextArea placeholder={t("输入地址和金额，用空格分隔 例如：AKMqDy51FuMnc4poiGBczQvPh6819hQuLH 10")} />
                    </Form.Item>
                    <div className="text-c lighter">
                        <small>{t("wallet.estimated time")}：12s </small>
                    </div>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" loading={this.state.iconLoading}>
                        {t("button.send")}
                    </Button>
                    </Form.Item>
                </div>
                </Col>
            </Row>
        </Form>
        );
    }
} 

export default Multitonmulti;