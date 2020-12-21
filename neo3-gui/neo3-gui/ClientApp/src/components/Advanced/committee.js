/* eslint-disable */
import React, { useState } from 'react';
import _ from 'lodash';
import "../../static/css/advanced.css";
import '../../static/css/trans.css';
import { Layout, Tabs, Row, Col, Modal, Button,Input,Select,Form,InputNumber } from 'antd';
import { Statistic, Button,Slider,InputNumber } from 'antd';
import { withRouter } from "react-router-dom";
import Sync from '../sync';
import { observer, inject } from "mobx-react";
import { useTranslation, withTranslation , Trans} from "react-i18next";
import { post } from "../../core/request";
import { ArrowLeftOutlined,RetweetOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Content } = Layout;
const { TabPane } = Tabs;

@withTranslation()
@withRouter
@observer
@inject("walletStore")
class AdvancedCommittee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      show: false,
      accounts:[],
      blocked: true,
      title:"111",
      transnum:0,
      blocksize:0,
      blockfee:0,
      bytefee:0,
    };
  }
  componentDidMount() {
    this.getMaxTrans();
    this.getBlocksize();
    this.getBlockFee();
    this.getByteFee();

    const account = this.props.walletStore.accountlist;
    console.log(account)
    
    const accounts = Array.call([],...this.props.walletStore.accountlist);
    console.log(accounts);

    const add = []
    Array.call([],...accounts).map(function (item) {
      let _item = {...item};
      add.push(_item);
      console.log(_item)
    });
    console.log(accounts)
    this.setState({
      accounts: add,
    });

  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  changeDialog=(ele)=>{
    const { t } = this.props;
    return () => {
      const accounts = Array.call([],...this.props.walletStore.accountlist);
      switch (ele) {
        case 0:
          this.setState({
            title: "交易数设置",
            children: <TransNumber account={accounts} />,
          });
          break;
        case 1:
          this.setState({
            title: "区块大小设置",
            children: <BlockSize account={accounts}/>,
          });
          break;
        case 2:
          this.setState({
            title: "区块系统费设置",
            children: <BlockFee account={accounts}/>,
          });
          break;
        case 3:
          this.setState({
            title: "字节费用设置",
            children: <ByteFee account={accounts}/>,
          });
          break;
        case 4:
          this.setState({
            title: "账号锁定设置",
            children: <AccountState account={accounts} />,
          });
          break;
      }
      this.setState({
        visible: true,
      });
    };
  }
  getMaxTrans = () =>{
    post("GetMaxTransactionsPerBlock",{}).then(result =>{
      this.setState({
        transnum: result.data.result,
      });
    });
  }
  getBlocksize = () =>{
    post("GetMaxBlockSize",{}).then(result =>{
      this.setState({
        blocksize: result.data.result,
      });
    });
  }
  getBlockFee = () =>{
    post("GetMaxBlockSystemFee",{}).then(result =>{
      this.setState({
        blockfee: result.data.result,
      });
    });
  }
  getByteFee = () =>{
    post("GetFeePerByte",{}).then(result =>{
      this.setState({
        bytefee: result.data.result,
      });
    });
  }
  searchAdd = ({ target: { value } }) =>{
    console.log(value)
    const param = {"account":value};
    post("IsBlocked",param).then(result =>{
      console.log(result.data.result)
      this.setState({
        blocked: result.data.result,
      });
    });
  }
  render = () => {
    const { t } = this.props;
    const { transnum, blocksize, blockfee, bytefee, blocked } = this.state;
    return (
      <Layout className="gui-container">
      <Sync />
      <Content className="mt3">
        <Row gutter={[30, 0]} style={{ minHeight: "calc( 100vh - 120px )" }}>
          <Col span={24} className="bg-white pv4">
          <Tabs className="committe-title" defaultActiveKey="1">
                <TabPane tab={t("交易数设置")} key="1">
                  <Statistic title="当前交易数上限：" value={transnum} prefix={<RetweetOutlined />}/>
                  <Button onClick={this.changeDialog(0)}>修改当前交易数上限</Button>
                </TabPane>
                <TabPane tab={t("区块大小设置")} key="2">
                  <Statistic title="当前区块大小上限：" value={blocksize} prefix={<RetweetOutlined />}/>
                  <Button onClick={this.changeDialog(1)}>修改当前区块大小上限</Button>
                </TabPane>
                <TabPane tab={t("区块系统费设置")} key="3">
                  <Statistic title="当前区块系统费上限：" value={blockfee} prefix={<RetweetOutlined />}/>
                  <Button onClick={this.changeDialog(2)}>修改当前区块系统费上限</Button>
                </TabPane>
                <TabPane tab={t("字节费用设置")} key="4">
                  <Statistic title="当前区块系统费上限：" value={bytefee} prefix={<RetweetOutlined />}/>
                  <Button onClick={this.changeDialog(3)}>修改当前区块系统费上限</Button>
                </TabPane>
                <TabPane tab={t("账号设置")} key="5">
                  <h4 className="bolder mb4"></h4>
                  NLGMSsGTDsLbAfGCBJvNmUMj16kvHHjFpa<br />
                  NPwTFCHP9Pve6EChLp1HVQq9NTqcUr3PJS<br />
                  NRppSV6itDBzg8yecamWYEAyJTdkKEQo4i<br />
                  <Input
                    placeholder="选择想要查询的地址" 
                    prefix={<RetweetOutlined />} 
                    onChange={this.searchAdd}
                    />
                  {blocked?
                  <div className="">
                    已锁定
                  </div>:
                  <div className="">
                    未锁定-111
                  </div>}
                  <Button onClick={this.changeDialog(4)}>修改账号状态</Button>
                </TabPane>
              </Tabs>
          </Col>
        </Row>
      </Content>
      <Modal
          className="set-modal"
          title={<Trans>{this.state.title}</Trans>}
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={null}
        >
          {this.state.children}
        </Modal>
    </Layout>
    );
  }
}

export default AdvancedCommittee;

const TransNumber = ({account}) => {
  const [form] = Form.useForm();
  const [setInput, changeInput] = useState();
  const onChange = value => {
    changeInput(value)
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  const setTrans = values =>{
    console.log(values)
    // let params = {
    //   "limit":values.limit,
    //   "publicKeys":values.publicKeys
    // };
    // post("CreateMultiAddress",params).then(res =>{
    //   var _data = res.data;
    //   if (_data.msgType === -1) {
    //     message.error(<Trans>wallet.signature multi error</Trans>);
    //     return;
    //   } else {
    //     func();
    //     Modal.success({
    //       width: 600,
    //       title: <Trans>wallet.signature multi success</Trans>,
    //       content: (
    //           <div className="show-pri">
    //           <p><Trans>hash</Trans> ：{_data.result.scriptHash}</p>
    //           <p><Trans>wallet.address multi sign</Trans> ：{_data.result.address}</p>
    //           </div>
    //       ),
    //       okText:<Trans>button.ok</Trans>
    //     });
    //     form.resetFields();
    //   }
    // }).catch(function (error) {
    //   console.log(error);
    // });
  }
  if(account.length === 0) return null;
  return (
    <Row>
      <Form className="neo-form" form={form} onFinish={setTrans}>
        <h4>指定新的上限</h4>
        <Form.Item name="limit" rules={[{ required: true, message: t("wallet.please input signature min")}]}>
          <InputNumber
            placeholder={t("wallet.signature min input")}
            parser={value => value.replace(/[^0-9]/g, '')}
            step={1}  min={1}
            style={{ width: '100%'}}/>
        </Form.Item>
        <h4>选择签名的地址</h4>
        <Form.Item name="publicKeys" rules={[{ required: true, message: t("wallet.please input public key") }]}>
          <Select
            placeholder={t("wallet.signature public")}
            mode="tags"
            onChange={handleChange}
            className="multiadd"
            style={{ width: '100%'}}>
            {account.length>0?accounts.map((item)=>{
              return(
                <Option key={item.address}>{item.address}</Option>
              )
            }):null}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button style={{ 'width': '100%' }} type="primary" htmlType="submit" disabled={sigBTdisabled}>{t("button.confirm")}</Button>
        </Form.Item>
      </Form>
    </Row>
  )
};

const BlockSize = ({ hashdetail }) => {
  const { t } = useTranslation();
  const [setInput, changeInput] = useState();
  const onChange = value => {
    changeInput(value)
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }  
  return (
    <Row>
      <Col span={16}>
        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
          <Option key={1}>1</Option>
          <Option key={2}>2</Option>
          <Option key={3}>3</Option>
          <Option key={4}>4</Option>
        </Select>
      </Col>
      <Col span={12}>
        <Slider
          min={1}
          max={20}
          onChange={onChange}
          value={typeof setInput === 'number' ? setInput : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={100}
          style={{ margin: '0 16px' }}
          value={setInput}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

const BlockFee = ({ transfers }) => {
  const { t } = useTranslation();
  const [setInput, changeInput] = useState();
  const onChange = value => {
    changeInput(value)
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }  
  return (
    <Row>
      <Col span={16}>
        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
          <Option key={1}>1</Option>
          <Option key={2}>2</Option>
          <Option key={3}>3</Option>
          <Option key={4}>4</Option>
        </Select>
      </Col>
      <Col span={12}>
        <Slider
          min={1}
          max={20}
          onChange={onChange}
          value={typeof setInput === 'number' ? setInput : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={100}
          style={{ margin: '0 16px' }}
          value={setInput}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

const ByteFee = ({ transfers }) => {
  const { t } = useTranslation();
  const [setInput, changeInput] = useState();
  const onChange = value => {
    changeInput(value)
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }  
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={1}
          max={20}
          onChange={onChange}
          value={typeof setInput === 'number' ? setInput : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={100}
          style={{ margin: '0 16px' }}
          value={setInput}
          onChange={onChange}
        />
      </Col>
      <Col span={16}>
        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
          <Option key={1}>1</Option>
          <Option key={2}>2</Option>
          <Option key={3}>3</Option>
          <Option key={4}>4</Option>
        </Select>
      </Col>
    </Row>
  );
};

const AccountState = ({ transfers }) => {
  const { t } = useTranslation();
  const [setInput, changeInput] = useState();
  const onChange = value => {
    changeInput(value)
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  }  
  return (
    <Row>
      <Col span={16}>
        <Input
          min={1}
          max={100}
          style={{ margin: '0 16px' }}
          value={setInput}
          onChange={onChange}
        />
      </Col>
      <Col span={16}>
        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
          <Option key={1}>1</Option>
          <Option key={2}>2</Option>
          <Option key={3}>3</Option>
          <Option key={4}>4</Option>
        </Select>
      </Col>
    </Row>
  );
};