/* eslint-disable */
//just test replace wallet//
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Icon, Row, Col, Modal, List, Button, Typography, message, Tag } from 'antd';
import Intitle from '../Common/intitle';
import { withTranslation } from "react-i18next";


const { Content } = Layout;

@withTranslation
class Untransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loacl: "",
      allpage: 0,
      page: 1,
      limit: 3,
      params: {},
      data: [],
      untranslist: [],
      loading: true,
      iswa: false,
    };
  }
  componentDidMount() {
    let path = location.pathname.split("/");
    path.pop()
    this.setState({
      loacl: path
    })
    this.selTrans()
  }
  selTrans = () => {
    let page = this.props.page ? this.props.page : "all";
    var _params = this.madeParams();
    if (page === "all") {
      this.allset(_params);
    } else if (page === "wallet") {
      this.walletset(_params);
    } else {
      this.allset(_params);
    }
  }
  madeParams = () => {
    return {
      "pageIndex": this.state.page,
      "limit": this.state.limit
    };
  }
  allset = params => {
    this.getAlluntrans(params, res => {
      this.setState({
        loading: false,
        data: res.result.list,
        untranslist: res.result.list,
        page: this.state.page + 1,
        allpage: Math.ceil(res.result.totalCount / this.state.limit)
      }, () => { console.log(this.state) });
    })
  }
  walletset = params => {
    this.getMyuntrans(params, res => {
      this.setState({
        loading: false,
        data: res.result.list,
        untranslist: res.result.list,
        page: this.state.page + 1,
        iswa: true,
        allpage: Math.ceil(res.result.totalCount / this.state.limit)
      }, () => { });
    })
  }
  getMyuntrans = (params, callback) => {
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "GetMyUnconfirmedTransactions",
      "params": params
    })
      .then(function (response) {
        var _data = response.data;
        if (_data.msgType === -1) {
          message.error("查询失败");
          return;
        } else {
          callback(_data);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  };
  getAlluntrans = (params, callback) => {
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "GetUnconfirmTransactions",
      "params": params
    })
      .then(function (response) {
        var _data = response.data;
        console.log("my")
        console.log(_data)
        if (_data.msgType === -1) {
          message.error("查询失败");
          return;
        } else {
          callback(_data);
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  };
  loadUnMore = () => {
    this.setState({
      loading: true,
    });
    var _params = this.madeParams();
    this.getAlluntrans(_params, res => {
      const data = this.state.data.concat(res.result.list);
      const _page = this.state.page + 1;
      this.setState(
        {
          data: data,
          untranslist: data,
          loading: false,
          page: _page
        },
        () => {
          window.dispatchEvent(new Event('resize'));
          console.log(this.state);
        },
      );
    });
  }
  loadMyUnMore = () => {
    this.setState({
      loading: true,
    });
    var _params = this.madeParams();
    this.getMyuntrans(_params, res => {
      const data = this.state.data.concat(res.result.list);
      const _page = this.state.page + 1;
      this.setState(
        {
          data: data,
          untranslist: data,
          loading: false,
          page: _page
        },
        () => {
          window.dispatchEvent(new Event('resize'));
          console.log(this.state);
        },
      );
    });
  }
  render = () => {
    const { t } = this.props;
    const { untranslist, loading, iswa, page, allpage } = this.state;
    const loadUnMore = !loading && page <= allpage ? (
      <div className="text-c mb3">
        {iswa ? (<Button type="primary" onClick={this.loadMyUnMore}>加载更多</Button>)
          : (<Button type="primary" onClick={this.loadUnMore}>加载更多</Button>)}
      </div>
    ) : null;
    return (
      <div>
        <Content className="mt3 mb4">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': '120px' }}>
            <Col span={24} className="bg-white pv4">
              <Intitle content={this.props.content || "未确认交易"} />
              <List
                header={<div><span>{t("transaction hash")}</span><span className="float-r ml4"><span className="wa-amount"></span>{t("count")}</span><span className="float-r">{t("time")}</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                loading={loading}
                loadMore={loadUnMore}
                dataSource={untranslist}
                className="font-s"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<div className="link-style">{item.txId}</div>}
                      description={
                        <div className="font-s">
                          From：<span className="w300 ellipsis">{item.transfers[0].fromAddress ? item.transfers[0].fromAddress : "--"}</span><br></br>
                        To：<span className="w300 ellipsis" >{item.transfers[0].toAddress ? item.transfers[0].toAddress : "--"}</span>
                        </div>
                      }
                    />
                    <Typography>{item.blockTime}</Typography>
                    <Typography className="upcase ml4"><span className="wa-amount">{item.transfers[0].amount}</span>{item.transfers[0].symbol}</Typography>
                  </List.Item>
                )}
              />
            </Col>
            <div className="pv1"></div>
          </Row>
        </Content>
      </div>
    );
  }
}

export default Untransaction;