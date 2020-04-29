/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Checkbox,
  PageHeader,
  Modal,
  Alert,
  Row,
  Col,
  Form,
  Select,
  Button, 
  message} from 'antd';
import { Layout } from 'antd';
import Sync from '../sync';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "../../static/css/advanced.css";

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;
const { Content } = Layout;

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Advancedcandidate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      accountlist: [],
    };
  }
  componentDidMount() {
    this.listPublicKey(res=>{
      this.setState({
        accountlist:res.result
      })
    });
  }
  listPublicKey = callback => {
    const { t } = this.props;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "ListCandidatePublicKey"
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data)
      if (_data.msgType === -1) {
        let res = _data.error;
        Modal.error({
          title: t('contract.fail title'),
          width: 400,
          content: (
            <div className="show-pri">
              <p>{t('error code')}: {res.code}</p>
              <p>{t('error msg')}: {res.message}</p>
            </div>
          ),
          okText: t("button.ok")
        });
        return;
      } else if (_data.msgType === 3) {
        callback(_data);
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  onCandidate = fieldsValue =>{
    const { t } = this.props;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "ApplyForValidator",
      "params":{
        "pubkey":fieldsValue.pubkey
    }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if (_data.msgType === -1) {
        let res = _data.error;
        Modal.error({
          title: t('advanced.candidate fail'),
          width: 400,
          content: (
            <div className="show-pri">
              <p>{t('error code')}: {res.code}</p>
              <p>{t('error msg')}: {res.message}</p>
            </div>
          ),
          okText: t("button.ok")
        });
        return;
      } else if (_data.msgType === 3) {
        Modal.success({
          title: t('advanced.candidate success'),
          width: 400,
          content: (
            <div className="show-pri">
              <p>TxID : {_data.result.txId?_data.result.txId:"--"}</p>
            </div>
          ),
          okText:t('button.ok')
        });
        return;
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
  }
  render = () => {
    const { t } = this.props;
    const { disabled, accountlist } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} style={{ 'minHeight': 'calc( 100vh - 120px )' }}>
            <Col span={24} className="bg-white pv4">
            <PageHeader title={t('advanced.candidate')}></PageHeader>
            
            <div className="pa3">
            <Alert
                className="mt3 mb3"
                type="warning"
                message={<div>
                  <p className="bolder mb5">{t('advanced.candidate')}</p>
                  <p className="mb5 font-s">{t('advanced.candidate info')}</p>
                  <ul className="list-num">
                    <li>{t('advanced.candidate step1')}</li>
                    <li>{t('advanced.candidate step2')}</li>
                    <li>{t('advanced.candidate step3')}</li>
                  </ul>
                </div>}
                showIcon
            />
            <Form ref="formRef" onFinish={this.onCandidate}>
                <h4 className="bolder mb4">{t('advanced.be candidate')}</h4>
                <Form.Item
                name="pubkey"
                className="select-vote"
                rules={[
                    {
                    required: true,
                    message: t("advanced.need address"),
                    },
                ]}
                >
                <Select
                placeholder={t("advanced.select address")}
                style={{ width: '100%' }}
                onChange={this.setAddress}>
                  {accountlist.map((item)=>{
                    return(
                    <Option key={item.publicKey}>{item.address}</Option>
                    )
                  })}
                </Select>
                </Form.Item>
                <p className="text-c mt3">
                  <Button type="primary" htmlType="submit" disabled={disabled} loading={this.state.iconLoading}>
                    {t("button.confirm")}
                  </Button>
                </p>
              </Form>
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Advancedcandidate;