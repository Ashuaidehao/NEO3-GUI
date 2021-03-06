/* eslint-disable */ 
//just test replace wallet//
import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Row, Col, message,List,Typography,Tag  } from 'antd';
import axios from 'axios';
import Intitle from '../Common/intitle';
import Transaction from '../Transaction/transaction';
import Sync from '../sync';

const { Content } = Layout;

class Contractdetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      detail: {},
      hash:"",
      storage:false,
      payable:false,
    };
  }
  componentDidMount(){
    let _hash = location.pathname.split(":").pop();
    this.contractDetail(_hash,res=>{
        this.setState({
            hash:_hash,
            detail:res.result,
            storage:res.result.hasStorage,
            payable:res.result.payable
        })
    })
  }
  contractDetail = (hash,callback) => {
    axios.post('http://localhost:8081', {
        "id":"1111",
        "method": "GetContract",
        "params": {
            "contractHash":hash
        }
    })
    .then(function (response) {
      var _data = response.data;
      console.log(_data);
      if(_data.msgType === -1){
        message.info("该hash不存在，请检查后再尝试");
        return;
      }else if(_data.msgType === 3){
        callback(_data)
      }
    })
    .catch(function (error) {
      console.log(error);
      console.log("error");
    });
}
  render(){
    const {detail,storage,payable} = this.state;
    console.log(detail)
    return (
    <Layout className="gui-container">
        <Sync/> 
        <Content className="mt3">
        <Row gutter={[30, 0]} type="flex">
        <Col span={24} className="bg-white pv4">
            <Intitle className="mb2" content="合约详情"/>
            <div className="info-detail pv3">
                <div className="f-1 pa3">
                    <span>脚本散列: &nbsp;&nbsp;&nbsp;</span>{detail.contractHash} 
                    {storage?<Tag className="ml3 ant-tag-green">storage</Tag>:null}
                    {payable?<Tag className="ml3 ant-tag-green">payable</Tag>:null}
                </div>
                {/* <Row>
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
                            <li><span className="hint">大小：</span>{blockdetail.size}</li>
                            <li><span className="hint">随机数：</span>{nonce}</li>
                            <li><span className="hint">系统费：</span>{blockdetail.networkFee?blockdetail.networkFee:'--'}</li>
                            <li><span className="hint">见证人：</span>{witness}</li>
                            <li><span className="hint">下一区块：</span><Link to={"/chain/detail:" + (blockdetail.blockHeight+1)} onClick={this.setHeight(blockdetail.blockHeight+1)}>{blockdetail.blockHeight+1}</Link></li>
                        </ul>
                    </Col>
                </Row> */}
              </div>
        </Col>
        </Row>
    </Content>
    </Layout>
    );
  }
} 

export default Contractdetail;