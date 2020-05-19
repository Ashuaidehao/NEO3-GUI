/* eslint-disable */
import React from 'react';
import { observer, inject } from "mobx-react";
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Alert,
  Input,
  PageHeader,
  InputNumber,
  Modal,
  Tabs,
  Row,
  Col
} from 'antd';
import { Layout } from 'antd';
import '../../static/css/wallet.css';
import Multitomulti from './multitomulti';
import Onetomulti from './onetomulti';
import Sync from '../sync';

import { withTranslation } from "react-i18next";

const { Content } = Layout;
const { TabPane  } = Tabs;

@withTranslation()
@inject("walletStore")
@observer
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
  transfer = fieldsValue => {
    // let _sender = this.state.addresslist[fieldsValue.sender].address;
    // let _this = this;
    // const{t}=this.props;
    // this.setState({
    //   iconLoading: true
    // })
    // axios.post('http://localhost:8081', {
    //   "id": "5",
    //   "method": "SendToAddress",
    //   "params": {
    //     "sender": _sender,
    //     "receiver": fieldsValue.receiver.trim(),
    //     "amount": fieldsValue.amount,
    //     "asset": fieldsValue.asset
    //   }
    // })
    // .then(function (response) {
    //   var _data = response.data;
    //   _this.setState({ iconLoading: false });
    //   if(_data.msgType === -1){
    //     let res = _data.error;
    //     Modal.error({
    //       title: t('wallet.transfer send error'),
    //       width: 400,
    //       content: (
    //         <div className="show-pri">
    //           <p>{t("error code")}: {res.code}</p>
    //           <p>{t("error msg")}: {res.message}</p>
    //         </div>
    //       ),
    //       okText:"确认"
    //     });
    //     return;
    //   }else{
    //     Modal.success({
    //       title: t('wallet.transfer send success'),
    //       content: (
    //         <div className="show-pri">
    //           <p>{t("blockchain.transaction hash")}：{_data.result.txId}</p>
    //         </div>
    //       ),
    //       okText:"确认"
    //     });
    //     _this.refs.formRef.resetFields()
    //     _this.setState({
    //       selectadd:[]
    //     })
    //   }
    // })
    // .catch(function (error) {
    //   console.log(error);
    //   console.log("error");
    // });
  }
  render() {
    const { t } = this.props;
    const {addresslist} = this.state;
    const account = this.props.walletStore.accountlist;
    return (
      <Layout className="gui-container">
        <Sync />
        <Content className="mt3">
          <Row gutter={[30, 0]} className="mb1">
            <Col span={24} className="bg-white pv4">
              <Tabs className="tran-title" defaultActiveKey="1">
                <TabPane tab={t("转账")} key="1">
                  <Multitomulti account={addresslist}  />
                </TabPane>
                <TabPane tab={t("批量转账")} key="2">
                  <Onetomulti account={addresslist}  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default Transfer;