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
  Radio,
  message} from 'antd';
import { Layout } from 'antd';
import Sync from '../sync';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "../../static/css/advanced.css";
import { shell } from "electron";

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;
const { Content } = Layout;

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Advancedvote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      candidates:[],
    };
  }
  componentDidMount() {
    this.listCandidate(res=>{
      this.setState({
        candidates:res.result
      })
    });
  }
  listCandidate = callback => {
    const { t } = this.props;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "GetValidators"
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
  onChange = checkedList => {
    this.setState({
      checkedList
    });
  };
  onVote = fieldsValue =>{
    const { t } = this.props;
    let {checkedList} = this.state;
    if(checkedList.length <= 0) {
      message.error(t('advanced.vote fail info'));
      return;
    }
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "VoteCN",
      "params": {
        "account": fieldsValue.voter,
        "pubkeys": checkedList
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if (_data.msgType === -1) {
        let res = _data.error;
        Modal.error({
          title: t('advanced.vote fail'),
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
          title: t('advanced.vote success'),
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
  openUrl (url) {
    return ()=>{
      shell.openExternal(url);
    }
  }
  render = () => {
    const { t } = this.props;
    const { disabled, candidates } = this.state;
    const accounts = this.props.walletStore.accountlist;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} style={{ 'minHeight': 'calc( 100vh - 120px )' }}>
            <Col span={24} className="bg-white pv4">
            <PageHeader title={t('advanced.vote')}></PageHeader>
            <div className="pa3">
            <Alert
              className="mt3 mb3"
              type="warning"
              message={<div>
                <p className="bolder mb5">{t('advanced.vote')}</p>
                <p className="mb5 font-s">{t('advanced.vote info')}</p>
                <ul className="list-num mb5">
                  <li>{t('advanced.vote step1')}</li>
                  <li>{t('advanced.vote step2')}</li>
                  <li>{t('advanced.vote step3')}</li>
                </ul>
                <p className="mb5 font-s">{t('advanced.vote after')}</p>
              </div>}
              showIcon
            />
                                
            {/* <Form ref="formRef" onFinish={this.onVote}> */}
            <Form ref="formRef" onFinish={this.oneVote}>
              <h4 className="bolder">{t('advanced.vote for')}</h4>
              <Form.Item
              name="voter"
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
                  {accounts.map((item)=>{
                    return(
                    <Option key={item.address}>{item.address}</Option>
                    )
                  })}
                </Select>
              </Form.Item>
                <h4>{t('advanced.candidate key')}<a className="ml2 small t-green" onClick={this.openUrl("https://neo.org/consensus")}> {t('advanced.candidate intro')}</a></h4>
              {/* <CheckboxGroup
                className="check-candi"
                value={this.state.checkedList}
                onChange={this.onChoose}
              >
                {candidates.map((item,index)=>{
                  return <p key={index}><Checkbox value={item.publickey}>{item.publickey}</Checkbox> <em className="small"> {item.votes} </em></p>
                })}
              </CheckboxGroup> 
              */}
              <Radio.Group
                className="check-candi"
                onChange={this.onChoose}
                value={this.state.value}>
                {candidates.map((item,index)=>{
                  return <p key={index}><Radio value={item.publickey}>{item.publickey}</Radio> <em className="small"> {item.votes} </em></p>
                })}
              </Radio.Group>
              <p className="text-c mt4">
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
  onChoose = e =>{
    console.log('radio checked', e.target.value);
    this.setState({
      value:e.target.value
    });
  }
  oneVote = fieldsValue =>{
    const { t } = this.props;
    let {value} = this.state;
    if(!value) {
      message.error(t('advanced.vote fail info'));
      return;
    }
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "VoteCN",
      "params": {
        "account": fieldsValue.voter,
        "pubkeys": [value]
      }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if (_data.msgType === -1) {
        let res = _data.error;
        Modal.error({
          title: t('advanced.vote fail'),
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
          title: t('advanced.vote success'),
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
}

export default Advancedvote;