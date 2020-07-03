/* eslint-disable */
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Form, message, Input, Button,Divider } from 'antd';
import { walletStore } from "../../store/stores";
import { useTranslation } from "react-i18next";
import { UserOutlined,LockOutlined } from '@ant-design/icons';
import { post } from "../../core/request";
import { remote } from 'electron';

const { dialog } = remote;

const Walletopen = ({feedback}) => {
  feedback = feedback ? feedback:onOpen;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  return (
    <div className="open">
      <Form form={form} onFinish={feedback}>
        <Form.Item name="path" onClick={opendialog(form)} rules={[{ required: true, message: 'Please input your Path!-未翻译' }]}>
          <Input disabled className="dis-file" prefix={<UserOutlined />} placeholder={t("please select file location")}/>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!-未翻译' }]} >
          <Input.Password placeholder={t("please input password")} maxLength={30} prefix={<LockOutlined />}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{t("button.confirm")}</Button>
        </Form.Item>
      </Form>
    </div>
  )
};

const Walletcreate = ({feedback}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  feedback = feedback ? feedback:onCreate;
  return (
    <div className="open">
      <Form form={form} onFinish={feedback}>
        <Form.Item name="path" onClick={opensavedialog(form)} rules={[{ required: true, message: 'Please input your Path!-未翻译' }]}>
          <Input disabled className="dis-file" prefix={<UserOutlined />} placeholder={t("please select file location")}/>
        </Form.Item>
        <Form.Item name="pass" rules={[{ required: true, message: 'Please input your Password!-未翻译' }]} hasFeedback >
          <Input.Password placeholder={t("please input password")} maxLength={30} prefix={<LockOutlined />}/>
        </Form.Item>
        <Form.Item name="veripass" dependencies={['pass']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('pass') === value) return Promise.resolve();
              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
        >
          <Input.Password placeholder={t("please input password")} maxLength={30} prefix={<LockOutlined />}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">{t("button.confirm")}</Button>
        </Form.Item>
      </Form>
    </div>
  )
};

const Walletprivate = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [showElem, changeShow] = useState(false);
  const veriPrivate = () =>{
    let params = {"privateKey":"L2tDYRq9g1gkWACZrw1Qu7BsAFufwArNgodYTvPjF8Ar7u34rBUf"};
    post("VerifyPrivateKey",params).then(res =>{
      var _data = res.data;
      if (_data.msgType === -1) {
        message.error("私钥验证失败");
        return;
      } else {
        message.success("私钥验证成功");
        changeShow(true)
        // walletStore.setWalletState(true);
      }
    }).catch(function (error) {
      console.log("error");
      console.log(error);
      // _this.props.history.goBack();
    });
  }
  return (
    <div className="open">
      <Form form={form} onFinish={veriPrivate}>
        <Form.Item name="private" rules={[{ required: true, message: 'Please input your Path!-未翻译' }]}>
          <Input disabled={showElem} placeholder={t("please input Hex/WIF private key")}/>
        </Form.Item>
        {!showElem?(
        <Form.Item>
          <Button type="primary" htmlType="submit">{t("button.next")}</Button>
        </Form.Item>
        ):null}
      </Form>
      {showElem?(
        <div>
            <Button onClick={() => changeShow(false)}>{t("button.prev")}</Button>
            <Divider>{t("wallet.private key save wallet title")}</Divider>
            <Walletcreate feedback={onPrivate("priva")}></Walletcreate>
        </div>
      ):null}
    </div>
  )
};

// wallet操作方法
// 打开钱包
const onOpen = values => {
  let params = {
    "path": values.path,
    "password": values.password
  };
  post("OpenWallet",params).then(res =>{
    var _data = res.data;
    if (_data.msgType === -1) {
      message.error("钱包打开失败，路径or密码错误");
      return;
    } else {
      message.success("登录成功");
      walletStore.setWalletState(true);
    }
    return;
  }).catch(function () {
    console.log("error");
    _this.props.history.goBack();
  });
};

const onCreate = values => {
  let params = {
    "path": values.path,
    "password": values.veripass,
    "privateKey": values.private || ""
  };
  post("CreateWallet",params).then(res =>{
    var _data = res.data;
    if (_data.msgType === -1) {
      message.error("钱包创建失败");
      return;
    } else {
      message.success("钱包创建成功");
      walletStore.setWalletState(true);
    }
  }).catch(function () {
    console.log("error");
    _this.props.history.goBack();
  });
};

// 私钥打开方式
const onPrivate = (priva) => {
  priva = "444ad6089aea71e7d3d5f3ed274a977055af2d40ad140f8ce4eb135122bea68d";
  return (values)=>{
    values.private = priva;
    onCreate(values);
  }
  // let params = {
  //   "path": values.path,
  //   "password": values.veripass,
  //   "privateKey": values.privateKey
  // };
  // post("CreateWallet",params).then(res =>{
  //   var _data = res.data;
  //   if (_data.msgType === -1) {
  //     message.error("钱包创建失败");
  //     return;
  //   } else {
  //     message.success("钱包创建成功");
  //     walletStore.setWalletState(true);
  //   }
  // }).catch(function () {
  //   console.log("error");
  //   _this.props.history.goBack();
  // });
};


//打开弹窗
const opendialog = (form) => {
  return ()=>{
    dialog.showOpenDialog({
      title: 't("wallet.open wallet file")',
      defaultPath: '/',
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }]
    }).then(function (res) {
      form.setFieldsValue({
        path: res.filePaths[0]
      });
    }).catch(function (error) {
      console.log(error);
      console.log("文件打开错误");
    })
  }
}

//保存弹窗
const opensavedialog = (form) => {
  return ()=>{
    dialog.showSaveDialog({
      title: 't("wallet.save wallet file title")',
      defaultPath: '/',
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    }).then(function (res) {
      form.setFieldsValue({
        path: res.filePath
      });
    }).catch(function (error) {
      console.log(error);
      console.log("钱包存储错误");
    })
  }
}


export { Walletopen,Walletcreate,Walletprivate }