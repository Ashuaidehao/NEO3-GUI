/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Alert, Input,
  PageHeader,
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
import { Form, DatePicker, TimePicker } from 'antd';
import Sync from '../sync';
import { withTranslation } from "react-i18next";

const { Option } = Select;
const { Content } = Layout;
const AutoCompleteOption = AutoComplete.Option;


const { MonthPicker, RangePicker } = DatePicker;

@withTranslation()
class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      iconLoading: false,
      addresslist: [],
      selectadd: []
    };
  }
  componentDidMount() {
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1234",
      "method": "GetMyBalances",
      "params": {}
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) {
        message.error(t("wallet.open wallet first"));
        return;
      }
      _this.setState({
        addresslist: _data.result
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log("error2");
    });
  }
  setAddress = target => {
    target = target ? target : 0;
    let _detail = this.state.addresslist[target].balances;
    this.setState({
      selectadd: _detail
    })
  }
  getAsset = () => {
    this.setState({
      neo: _data.result.accounts
    })
  }
  transfer = fieldsValue => {
    let _sender = this.state.addresslist[fieldsValue.sender].address;
    let _this = this;
    const{t}=this.props;
    this.setState({
      iconLoading: true
    })
    axios.post('http://localhost:8081', {
      "id": "5",
      "method": "SendToAddress",
      "params": {
        "sender": _sender,
        "receiver": fieldsValue.receiver.trim(),
        "amount": fieldsValue.amount,
        "asset": fieldsValue.asset
      }
    })
    .then(function (response) {
      var _data = response.data;
      _this.setState({ iconLoading: false });
      if(_data.msgType === -1){
        let res = _data.error;
        Modal.error({
          title: t('wallet.transfer send error'),
          width: 400,
          content: (
            <div className="show-pri">
              <p>{t("error code")}: {res.code}</p>
              <p>{t("error msg")}: {res.message}</p>
            </div>
          ),
          okText:"确认"
        });
        return;
      }else{
        Modal.success({
          title: t('wallet.transfer send success'),
          content: (
            <div className="show-pri">
              <p>{t("blockchain.transaction hash")}：{_data.result.txId}</p>
            </div>
          ),
          okText:"确认"
        });
        _this.refs.formRef.resetFields()
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render() {
    const { t } = this.props;
    const { size, addresslist, selectadd } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Form ref="formRef" className="trans-form" onFinish={this.transfer}>
            <Row gutter={[30, 0]} className="bg-white pv4" style={{ 'minHeight': 'calc( 100vh - 150px )' }}>
              <Col span={24}>
                <PageHeader title={t("wallet.transfer")}></PageHeader>
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
                      size={size}
                      placeholder={t("select account")}
                      style={{ width: '100%' }}
                      onChange={this.setAddress}>
                      {addresslist.map((item, index) => {
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
                          {selectadd.map((item, index) => {
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
        </Content>
      </Layout>
    );
  }
}

export default Transfer;