/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, message,List,Typography } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import Sync from '../sync';
import { withTranslation } from 'react-i18next';

const { Content } = Layout;

@withTranslation()
class Assetdetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      blockdetail: {},
      height:0,
      witness:"",
      nonce:0,
    };
  }
  componentDidMount(){
    let _h = Number(location.pathname.split(":").pop())
    this.setHash(_h)();
    this.setState({
      local:location.pathname
    })
  }
  getAsset = () =>{
      // console.log("数据暂无")
    // var _this = this;
    // let _height = this.state.height;
    // axios.post('http://localhost:8081', {
    //   "id":"1111",
    //     "method": "GetBlock",
    //     "params": {
    //       "index": _height
    //     }
    //   })
    // .then(function (response) {
    //   var _data = response.data;
    //   console.log(_data);
    //   if(_data.msgType === -1){
    //     message.info("查询失败,该高度错误");
    //     return;
    //   }
    //   _this.setState({
    //     blockdetail:_data.result,
    //     witness:_data.result.witness.scriptHash,
    //     nonce:_data.result.consensusData.nonce,
    //     translist:_data.result.transactions
    //   })
    // })
    // .catch(function (error) {
    //   console.log(error);
    //   console.log("error");
    // });
  }
  setHash = (h) => {
    return () =>{
        this.setState({
            hash: h
        },() => this.getAsset());
    }
  }
  render(){
    const {blockdetail,witness,nonce} = this.state;
    const { t } = this.props;
    return (
      <Layout className="gui-container">
          <Sync/>
          <Content className="mt3">
          {/* <Row gutter={[30, 0]} type="flex">
            <Col span={24} className="bg-white pv4">
              <Intitle className="mb2" content="区块信息"/>
              <div className="info-detail pv3">
                <div className="f-1 pa3"><span>Hash: &nbsp;&nbsp;&nbsp;</span>{blockdetail.blockHash}</div>
                <Row>
                    <Col span={12}>
                        <ul className="detail-ul">
                            <li><span className="hint">高度：</span>{blockdetail.blockHeight}</li>
                            <li><span className="hint">时间戳：</span>{blockdetail.blockTime}</li>
                            <li><span className="hint">网络费：</span>{blockdetail.networkFee?blockdetail.networkFee:'--'}</li>
                            <li><span className="hint">确认数：</span>{blockdetail.confirmations}</li>
                            <li><span className="hint">上一区块：</span><Link to={"/chain/detail:" + (blockdetail.blockHeight-1)} onClick={this.setHeight(blockdetail.blockHeight-1)}>{blockdetail.blockHeight-1}</Link></li>
                        </ul>
                    </Col>
                    <Col span={12}>
                        <ul className="detail-ul">
                            <li><span className="hint">大小：</span>{blockdetail.blockHeight}</li>
                            <li><span className="hint">随机数：</span>{nonce}</li>
                            <li><span className="hint">系统费：</span>{blockdetail.networkFee?blockdetail.networkFee:'--'}</li>
                            <li><span className="hint">见证人：</span>{witness}</li>
                            <li><span className="hint">下一区块：</span><Link to={"/chain/detail:" + (blockdetail.blockHeight+1)} onClick={this.setHeight(blockdetail.blockHeight+1)}>{blockdetail.blockHeight+1}</Link></li>
                        </ul>
                    </Col>
                </Row>
              </div>
            </Col>
          </Row> */}
          <Transaction content={t("transaction list")} page="assetdetail"/>
        </Content>
      </Layout>
    );
  }
} 

export default Assetdetail;