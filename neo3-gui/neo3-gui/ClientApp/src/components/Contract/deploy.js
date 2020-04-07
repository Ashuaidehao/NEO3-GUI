/* eslint-disable */
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Input,
  Icon,
  PageHeader,
  Modal,
  Select,
  Row,
  Col,
  Form,
  message,
  Menu,
  Button,
} from 'antd';
import { Layout } from 'antd';
import Intitle from '../Common/intitle';
import '../../static/css/wallet.css';
import Sync from '../sync';
import { FolderOpenOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";


const { Content } = Layout;
const { dialog } = window.remote;

const { TextArea } = Input;

@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Contractdeploy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      mapath: "",
      expath: "",
      disabled: true,
      visible: false,
      func: "",
      cost: -1,
      isOpenDialog: false,
    };
  }
  selectNef = () => {
    this.opendialog("nef", res => {
      this.setState({
        expath: res.filePaths[0],
        isOpenDialog: false,
      }, () => { this.onFill() });
    })
  }
  selectMani = () => {
    this.opendialog("manifest.json", res => {
      this.setState({
        mapath: res.filePaths[0],
        isOpenDialog: false
      }, () => { this.onFill() });
    })
  }
  browseDialog = () => {
    const { isOpenDialog } = this.state;
    if (isOpenDialog === false) {
      return false;
    } else {
      return true;
    }
  }
  opendialog = (str, callback) => {
    if (this.browseDialog()) return;
    const { t } = this.props;
    str = str || "";
    this.setState({ disabled: true, isOpenDialog: true })
    dialog.showOpenDialog({
      title: t('contract page.select {file} path title', { file: str }),
      defaultPath: '/',
      filters: [
        {
          name: '*',
          extensions: [str]
        }
      ]
    }).then(function (res) {
      callback(res);
    }).catch(function (error) {
      console.log(error);
    })
  }
  onFill = () => {
    this.refs.formRef.setFieldsValue({
      nefPath: this.state.expath,
      manifestPath: this.state.mapath,
      tresult: this.state.tresult
    });
  };
  onTest = () => {
    const { t } = this.props;
    this.refs.formRef.validateFields().then(data => {
      let _params = data;
      _params.sendTx = false;
      this.deployContract(_params, res => {
        console.log(res);
        this.setState({
          disabled: false,
          tresult: JSON.stringify(res.result),
          cost: res.result.gasConsumed
        }, this.onFill());
      })
    }).catch(function () {
      message.error(t("contract page.please select file path"));
    })
  }
  ondeploy = fieldsValue => {
    const { t } = this.props;
    let _params = fieldsValue;
    _params.sendTx = true;
    this.deployContract(_params, res => {
      Modal.info({
        title: t('contract page.deploy success'),
        width: 600,
        content: (
          <div className="show-pri">
            <p>TxID: {res.result.txId ? res.result.txId : "--"}</p>
            <p>ScrptHash: {res.result.contractHash ? res.result.contractHash : "--"}</p>
            <p>Gas: {res.result.gasConsumed ? res.result.gasConsumed : "--"}</p>
          </div>
        ),
        okText: t("button.ok")
      });
      this.refs.formRef.setFieldsValue({
        nefPath: "",
        manifestPath: "",
        tresult: ""
      });
    })
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
          title: t('contract page.fail title'),
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
  render = () => {
    const { t } = this.props;
    const { disabled, cost } = this.state;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={t('contract page.deploy contract')}></PageHeader>
              <Form ref="formRef" className="trans-form mt3" onFinish={this.ondeploy}>
                <Form.Item
                  name="nefPath"
                  label="Neo Executable File (.nef)"
                  onClick={this.selectNef}
                  rules={[
                    {
                      required: true,
                      message: t("contract page.please select file path")
                    },
                  ]}
                >
                  <Input className="dis-file" placeholder={t('select file')} disabled suffix={<FolderOpenOutlined />}
                  />
                </Form.Item>
                <Form.Item
                  name="manifestPath"
                  label="Neo Contract Manifest (.manifest.json)"
                  onClick={this.selectMani}
                  rules={[
                    {
                      required: true,
                      message: t("contract page.please select file path")
                    },
                  ]}
                >
                  <Input className="dis-file" placeholder={t('select file')} disabled suffix={<FolderOpenOutlined />}
                  />
                </Form.Item>
                <Form.Item className="text-c w200" >
                  <Button type="primary" htmlType="button" onClick={this.onTest}>
                    {t('contract page.test deploy')}
                  </Button>
                </Form.Item>
                <div className="pa3 mb4">
                  <p className="mb5 bolder">{t('contract page.test result')}</p>
                  <TextArea rows={3} value={this.state.tresult} />
                </div>
                {/* {cost>=0?<p className="text-c small mt4 mb0">手续费：{cost} GAS</p>:null} */}
                <Form.Item className="text-c w200">
                  <Button type="primary" htmlType="submit" disabled={disabled} loading={this.state.iconLoading}>
                    {t("button.send")}
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Contractdeploy;