/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import 'antd/dist/antd.css';
import { Form, message, Input, Row, Col, Button,Typography } from 'antd';
import { walletStore } from "../../store/stores";
import { withRouter } from "react-router-dom";
import { withTranslation, useTranslation } from "react-i18next";
import { UserOutlined, FolderOpenOutlined,LockOutlined } from '@ant-design/icons';
import { post } from "../../core/request";
import { remote } from 'electron';


const { dialog } = remote;

const Walletopen = () => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [path,changePath] = useState("");
    const opendialog = () => {
      dialog.showOpenDialog({
        title: t("wallet.open wallet file"),
        defaultPath: '/',
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }]
      }).then(function (res) {
        changePath(res.filePaths[0]);
        form.setFieldsValue({
          path: res.filePaths[0]
        });
      }).catch(function (error) {
        console.log(error);
      })
    }
    const onFinish = values => {
        console.log('Received values of form: ', values);
        let params = {
          "path": values.path,
          "password": values.password
        };
        post("OpenWallet",params).then(res =>{
          var _data = res.data;
          console.log(_data)
          if (_data.msgType === -1) {
            message.error("查询s失败");
            return;
          } else {
          }
        }).catch(function () {
          console.log("error");
          _this.props.history.goBack();
        });
    };
    return (
      <div className="open">
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="path"
            onClick={opendialog}
            rules={[{ required: true, message: 'Please input your Path!-未翻译' }]}
          >
            <Input
              className="dis-file"
              prefix={<UserOutlined />}
              // suffix={<FolderOpenOutlined />}
              disabled
              placeholder={t("please select file location")}/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!-未翻译' }]}
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

// @withTranslation()
// @withRouter
// class Walletopen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       iconLoading: false,
//       islogin: false,
//       path: "",
//       maxLength: 30
//     };
//   }
//   verifi = () => {
//     const { t } = this.props;
//     var path = this.refs.path.input.value;
//     var pass = this.refs.pass.input.value;
//     if (!path || !pass) {
//       message.error(t("wallet.please select file and input password"), 3);
//       return;
//     }
//     this.setState({ iconLoading: true });
//     this.openWallet();
//   }
//   openWallet = () => {
//     const { t } = this.props;
//     var _this = this;
//     var pass = this.refs.pass.input.value;
//     axios.post('http://localhost:8081', {
//       "id": "1",
//       "method": "OpenWallet",
//       "params": {
//         "path": _this.state.path,
//         "password": pass
//       }
//     })
//     .then(function (res) {
//       let _data = res.data;
//       _this.setState({ iconLoading: false });
//       if (_data.msgType == 3) {
//         walletStore.setWalletState(true);

//         let page = (location.pathname).search(/contract/g)>0?1:((location.pathname).search(/advanced/g)>0?2:-1);
//         if(page === 1){
//           _this.props.history.push('/contract');
//         }else if(page === 2){
//           _this.props.history.push('/advanced');
//         }else{
//           message.success(t("wallet.wallet opened"), 3);
//           _this.props.history.push('/wallet/walletlist');
//         }
//       } else {
//         console.log(_data)
//         message.info(t("wallet.open wallet failed"), 2);
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//       console.log("error");
//     });
//   }
//   opendialog = () => {
//     const { t } = this.props;
//     var _this = this;
//     dialog.showOpenDialog({
//       title: t("wallet.open wallet file"),
//       defaultPath: '/',
//       filters: [
//         {
//           name: 'JSON',
//           extensions: ['json']
//         }
//       ]
//     }).then(function (res) {
//       _this.setState({ path: res.filePaths[0] });
//     }).catch(function (error) {
//       console.log(error);
//     })
//   }
//   render() {
//     const { t } = this.props;
//     return (
//       <div className="open">
//         <Row>
//           <Col span={18}>
//             <Input
//               disabled
//               ref="path"
//               placeholder={t("please select file location")}
//               value={this.state.path}
//               prefix={<UserOutlined />}/>
//           </Col>
//           <Col span={6}>
//             <Button type="primary" onClick={this.opendialog}>{t("wallet.select path")}</Button>
//           </Col>
//         </Row>
//         <Input.Password
//           ref="pass"
//           placeholder={t("please input password")}
//           maxLength={this.state.maxLength}
//           onChange={this.checkinput}
//           onPressEnter={this.openWallet} 
//           prefix={<LockOutlined />}/>
//         <Button className="mt3 mb2" type="primary" onClick={this.verifi} loading={this.state.iconLoading}>{t("button.confirm")}</Button>
//       </div>
//     );
//   }
// }

export { Walletopen }
// export default Notifies;