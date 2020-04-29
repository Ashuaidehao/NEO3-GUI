import React from 'react';
import axios from 'axios';
import { Input, message, Button } from 'antd';
import { remote } from 'electron';
const { dialog } = remote;

class CheckPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      show: true,
      iconLoading: false,
      hint: "输入正确"
    };
  }
  toTrim = (e) => {
    let _val = e.target.value;
    e.target.value = _val.trim();
  }
  notNull = (num) => {
    let _fpass = this.refs.fPass.input.value;
    let _spass = this.refs.sPass.input.value;

    if (!_fpass) {
      message.error('密码不可为空', 2); return false;
    }
    if (num === 0) return false;
    if (!_spass) {
      message.error('确认密码不可为空', 2); return false;
    }
    return true;
  }
  savedialog = () => {
    var _this = this;
    dialog.showSaveDialog({
      title: '保存图像文件',
      defaultPath: '/',
      filters: [
        {
          name: 'JSON',
          extensions: ['json']
        }
      ]
    }).then(function (res) {
      _this.setState({ path: res.filePath });
    }).catch(function (error) {
      console.log(error);
    })
  }
  createWallet = () => {
    var _this = this, _pass = this.refs.sPass.input.value;
    this.setState({ iconLoading: true });
    if (!_pass) return;
    axios.post('http://localhost:8081', {
      "id": "1",
      "method": "CreateWallet",
      "params": {
        "path": _this.state.path,
        "password": _pass,
        "privateKey": _this.props.private || ""
      }
    })
      .then(function (res) {
        let _data = res.data;
        _this.setState({ iconLoading: false });
        if (_data.msgType === 3) {
          message.success("钱包已创建", 2);
        } else {
          message.info("钱包文件选择错误，请检查后重试", 2);
        }

      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  onInpass = () => {
    if (!this.notNull(0)) return;
  }
  onVerify = () => {
    if (!this.notNull()) return;
    let _fpass = this.refs.fPass.input.value;
    let _spass = this.refs.sPass.input.value;

    if (_fpass !== _spass) {
      message.info('两次输入不一致，请确认后输入', 2);
    }
  }
  render = () => {
    return (
      <div className={this.props.priclass} private={this.state.private}>
        <Input placeholder="请选择文件存储位置" disabled value={this.state.path} />
        <Button onClick={this.savedialog}>选择路径</Button>

        <Input
          type="password"
          className={this.props.cname}
          placeholder="输入密码"
          data-value="输入密码"
          onKeyUp={this.toTrim}
          onBlur={this.onInpass}
          ref="fPass"
        />
        <Input
          type="password"
          placeholder="确认密码"
          data-value="确认密码"
          className={this.props.cname}
          onKeyUp={this.toTrim}
          onBlur={this.onVerify}
          ref="sPass"
        />
        <Button onClick={this.createWallet} loading={this.state.iconLoading} ref="create">创建钱包</Button>
      </div>
    )
  }
}

export default CheckPass;