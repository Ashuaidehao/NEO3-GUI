/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Input,
  Checkbox,
  PageHeader,
  Modal,
  Alert,
  Row,
  Col,
  Form,
  Button,
} from 'antd';
import { Layout } from 'antd';
import Sync from '../sync';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Select, Radio } from 'antd';
import "../../static/css/advanced.css"

const { Option } = Select;


const CheckboxGroup = Checkbox.Group;
const { Content } = Layout;

const plainOptions = ['Apple', 'Pear', 'Orange'];

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
    };
  }
  deployContract = (params, callback) => {
    const { t } = this.props;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "DeployContract",
      "params": params
    })
    .then(function (response) {
      var _data = response.data;
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
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    },()=>{
        console.log(checkedList)
    });
  };
  onCheckAllChange = e => {
    this.setState({
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
    },()=>{
        console.log(e)
        console.log(this.state)
    });
  };
  onVote = fieldsValue =>{
      console.log(fieldsValue)
  }
  render = () => {
    const { t } = this.props;
    const { disabled, cost } = this.state;
    const accounts = this.props.walletStore.accountlist;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]}>
            <Col span={24} className="bg-white pv4">
            <PageHeader title={t('advanced.vote')}></PageHeader>
            <Alert
                className="mt3 mb3"
                type="warning"
                message={t("advanced.select address")}
                showIcon
            />
                                
            <Form ref="formRef" onFinish={this.onVote}>
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
                <h4>{t('advanced.candidate key')}</h4>
                <p>
                    <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                    >
                    {t('advanced.select all')}
                    </Checkbox>
                </p>
                    <CheckboxGroup
                        value={this.state.checkedList}
                        onChange={this.onChange}
                    >
                    {plainOptions.map((item,index)=>{
                        return <p key={index}><Checkbox value={item}>{item}</Checkbox></p>
                    })}
                    </CheckboxGroup>
                <p className="text-c">
                    <Button type="primary" htmlType="submit" disabled={disabled} loading={this.state.iconLoading}>
                        {t("button.confirm")}
                    </Button>
                </p>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Advancedvote;