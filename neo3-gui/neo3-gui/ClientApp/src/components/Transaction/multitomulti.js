/* eslint-disable */
import React from 'react';
import axios from 'axios';
import {
  Modal, Input,
  Form,
  InputNumber,
  Select,
  Row,
  Col,
  message,
  Divider,
  Button,
} from 'antd';
import { Layout } from 'antd';
import '../../static/css/wallet.css'
import { withTranslation } from "react-i18next";
import { post } from "../../core/request";

import { MinusSquareOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select;


@withTranslation()
class Multitomulti extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            assetlist:[],
            addresslist:[]
        };
    }
    setAddress = (key) => {
        // 地址-index 键值对对照组
        if(this.state.addresslist.length === 0){
            var addresslist = {};
            this.props.account.map((item,index)=>{
                addresslist[item.address] = index;
            })
            this.setState({
                addresslist: addresslist
            })
        }
        return () =>{
            //对每个新增的field数据分别绑定
            var add = event.target?event.target.textContent:null;
            var target = this.state.addresslist[add];
            var _list = this.state.assetlist;
            _list[key] = this.props.account[target].balances;
            this.setState({ assetlist: _list })
        }
    }
    toTrim = value => {
        
    // setNumber({ ...validatePrimeNumber(value), value });

    //     console.log(e.target)
    //     this.formRef.current.setFieldsValue({
    //         receiver: (e.target.value).trim()
    //     });
    };
    transfer = values =>{
        const {t}=this.props;
        var _this = this;
        console.log(values)
        
        // this.setState({ iconLoading: true });
        // post("SendTo",values.params).then(res =>{
        //     var _data = res.data;
        //     var result = res.data.result;
        //     _this.setState({ iconLoading: true });
        //     if(_data.msgType === -1){
        //         let res = _data.error;
        //         Modal.error({
        //         title: t('wallet.transfer send error'),
        //         width: 400,
        //         content: (
        //             <div className="show-pri">
        //                 <p>{t("error code")}: {res.code}</p>
        //                 <p>{t("error msg")}: {res.message}</p>
        //             </div>
        //         ),
        //         okText:t("button.confirm")
        //         });
        //         return;
        //     }else{
        //         Modal.success({
        //         title: t('wallet.transfer send success'),
        //         content: (
        //             <div className="show-pri">
        //             <p>{t("blockchain.transaction hash")}：{result.txId}</p>
        //             </div>
        //         ),
        //         okText:t("button.confirm")
        //         });
        //         _this.refs.formRef.resetFields()
        //         _this.setState({
        //             assetlist:[],
        //             addresslist:[]
        //         })
        //     }
        // })
    }
    render = () =>{
        const { account, t } = this.props;
        const { assetlist } = this.state;
        return (
        <div className="w600 info-detail mt3">
        <Form ref="formRef" className="trans-form" onFinish={this.transfer}>
            <Form.List name="params">
                {(fields, { add, remove }) => {
                fields.length===0?add():null;
                return (
                    <div>
                    {fields.map((field) => (
                      <div key={field.key}>
                      <Row>
                        <Col span="15">
                        <Form.Item
                            name={[field.name, "sender"]}
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
                            onChange={this.setAddress(field.key)}>
                            {account.map((item,index) => {
                                return (
                                <Option key={item.address}>{item.address}</Option>
                                )
                            })}
                            </Select>
                        </Form.Item>
                        </Col>
                        <Col span="9">
                            <Form.Item
                                name={[field.name, "asset"]}
                                label={t("wallet.asset")}
                                rules={[
                                {
                                    required: true,
                                    message: t("wallet.required"),
                                },
                                ]}
                            >
                            <Select
                                placeholder={t("wallet.select")}
                                style={{ width: '100%' }}>
                                {!!assetlist[field.key]?assetlist[field.key].map((item) => {
                                    return (
                                    <Option key={item.asset}><span className="trans-symbol">{item.symbol} </span><small>{item.balance}</small></Option>
                                    )
                                }):null}
                            </Select>
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row>
                        <Col span="15">
                            {/*  pattern={value => value.replace(/[^0-9]/g, '')} */}
                        <Form.Item
                            name={[field.name, "receiver"]}
                            label={t("wallet.to")}
                            rules={[          {
                                pattern:"^[N][1-9A-HJ-NP-Za-km-z]{32,34}$",
                                message: t("wallet.address format"),
                            },
                            {
                                required: true,
                                message: t("wallet.please input a correct amount"),
                            },
                            ]}
                        >
                            <Input placeholder={t("input account")} />
                        </Form.Item>
                        </Col>
                        <Col span="9">
                        <Form.Item
                            name={[field.name, "amount"]}
                            label={t("wallet.amount")}
                            rules={[
                            {
                                required: true,
                                message: t("wallet.required"),
                            },
                            ]}>
                            <InputNumber min={0} step={1} placeholder={t("wallet.amount")} />
                        </Form.Item>
                        </Col>
                        {fields.length > 1 ? (
                            <Divider orientation="right">
                                <a className="delete-line" onClick={ () => { remove(field.name); }}><MinusSquareOutlined /> <span className="font-s">{t("wallet.delete add")}</span></a>
                            </Divider>
                        ) : null}
                      </Row>
                      </div>
                    ))}
                    <Form.Item className="mb0">
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        style={{ width: "100%" }}
                      >
                        <PlusOutlined /> {t("wallet.transfer add")}
                      </Button>
                    </Form.Item>
                  </div>
                );
                }}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {t("wallet.transfer bulk")}
                </Button>
            </Form.Item>
        </Form>
        </div>
        );
    }
} 

export default Multitomulti;