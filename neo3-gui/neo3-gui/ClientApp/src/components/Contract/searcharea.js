/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  Input,
  Icon,
  Cascader,
  Modal,
  Select,
  Row,
  Col,
  Form,
  message,
  Menu,
  Button, Drawer
} from 'antd';
import { Layout } from 'antd';
import Sync from '../sync';
import Topath from '../Common/topath';
import {
  ArrowRightOutlined,
  SearchOutlined
} from '@ant-design/icons';


const { Content } = Layout;
const { Search } = Input;

class Searcharea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'default',
      path: "",
      disabled: false,
      cname: "search-content"
    };
  }
  componentDidMount() {
    document.addEventListener('click', this.removeClass);
  }
  addClass = (e) => {
    this.stopPropagation(e);
    this.setState({
      cname: "search-content show-child",
      disabled: true,
    })
  }
  removeClass = () => {
    if (this.state.disabled) {
      this.setState({
        cname: "search-content",
        disabled: false,
      })
    }
  }
  stopPropagation(e) {
    e.nativeEvent.stopImmediatePropagation();
  }
  searchContract = () => {
    let _hash = (this.refs.sinput.input.value).trim();
    if (!_hash) { message.info("请输入后再试"); return; }
    var _this = this;
    axios.post('http://localhost:8081', {
      "id": "1111",
      "method": "GetContract",
      "params": {
        "contractHash": _hash
      }
    })
      .then(function (response) {
        var _data = response.data;
        console.log(_data);
        if (_data.msgType === -1) {
          message.info("该合约hash不存在，请检查后再尝试");
          return;
        } else if (_data.msgType === 3) {
          _this.setState({ topath: "/contract/detail:" + _hash });
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }
  render = () => {
    return (
      <div className="search-area">
        <Topath topath={this.state.topath}></Topath>
        <div className="search-btn">
          <SearchOutlined className="inset-btn" onClick={this.addClass} />
        </div>
        <div className={this.state.cname}>
          <div className="search-detail" ref="sarea" onClick={this.stopPropagation}>
            <Input
              placeholder="输入脚本散列"
              onPressEnter={this.searchContract}
              ref="sinput"
              defaultValue="0x8c23f196d8a1bfd103a9dcb1f9ccf0c611377d3b"
              suffix={<ArrowRightOutlined onClick={this.searchContract} />}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Searcharea;