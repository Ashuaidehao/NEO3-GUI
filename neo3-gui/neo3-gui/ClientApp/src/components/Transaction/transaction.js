/* eslint-disable */
//just test replace wallet//
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Row, Col, List, Button, Typography, message } from 'antd';
import Intitle from '../Common/intitle';
import { withTranslation } from "react-i18next";


const { Content } = Layout;
@withTranslation()
@inject("walletStore")
@observer
@withRouter
class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loacl: "",
      allpage: 0,
      page: 1,
      limit: 30,
      params: {},
      data: [],
      translist: [],
      loading: true,
      iswa: false,
    };
  }
  componentDidMount() {
    this.setState({
      loacl: location.pathname.split("/")[1]
    })
    this.selTrans()
  }
  selTrans = () => {
    let _hash = location.pathname.split(":").pop()
    let page = this.props.page ? this.props.page : "all";
    var _params = this.madeParams();
    if (page === "all") {
      this.allset(_params);
    } else if (page === "blockdetail") {
      _params.blockHeight = Number(_hash);
      this.setState({params:_params})
      this.allset(_params);
    } else if (page === "addressdetail") {
      _params.address = Number(_hash);
      this.setState({params:_params})
      this.nepset(_params);
    } else if (page === "assetdetail") {
      _params.asset = _hash;
      this.setState({params:_params})
      this.nepset(_params);
    } else if (page === "wallettrans") {
      this.walletset(_params);
    } else if (page === "walletdetail") {
      _params.address = _hash;
      this.walletset(_params);
    } else{
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
    this.getAlltrans(params, res => {
      this.setState({
        loading: false,
        data: res.result.list,
        translist: res.result.list,
        page: this.state.page + 1,
        allpage: Math.ceil(res.result.totalCount / this.state.limit)
      });
    })
  }
  nepset = params => {
    this.getNeptrans(params, res => {
      this.setState({
        loading: false,
        data: res.result.list,
        translist: res.result.list,
        page: this.state.page + 1,
        allpage: Math.ceil(res.result.totalCount / this.state.limit)
      });
    })
  }
  walletset = params => {
    this.getMytrans(params, res => {
      this.setState({
        loading: false,
        data: res.result.list,
        translist: res.result.list,
        page: this.state.page + 1,
        iswa: true,
        allpage: Math.ceil(res.result.totalCount / this.state.limit)
      });
    })
  }
  getMytrans = (params, callback) => {
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "GetMyTransactions",
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
  }
  getAlltrans = (params, callback) => {
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "QueryTransactions",
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
  getNeptrans = (params, callback) => {
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "QueryNep5Transactions",
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
  loadMore = () => {
    this.setState({
      loading: true,
    });
    var _flag = this.madeParams();
    var _params = Object.assign(this.state.params, _flag);
    this.getAlltrans(_params, res => {
      const data = this.state.data.concat(res.result.list);
      const _page = this.state.page + 1;
      this.setState(
        {
          data: data,
          translist: data,
          loading: false,
          page: _page
        },
        () => {
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  }
  loadMyMore = () => {
    this.setState({
      loading: true,
    });
    var _params = this.madeParams();
    this.getMytrans(_params, res => {
      const data = this.state.data.concat(res.result.list);
      const _page = this.state.page + 1;
      this.setState(
        {
          data: data,
          translist: data,
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
    const { translist, loacl, loading, iswa, page, allpage } = this.state;
    const loadMore = !loading && page <= allpage ? (
      <div className="text-c mb3">
        {iswa ? (<Button type="primary" onClick={this.loadMyMore}>{ t('load more') }</Button>)
          : (<Button type="primary" onClick={this.loadMore}>{ t('load more') }</Button>)}
      </div>
    ) : null;
    return (
      <div>
        <Content className="mt3 mb4">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': '120px' }}>
            <Col span={24} className="bg-white pv4">
              <Intitle content={this.props.content || t("lastest transactions")} />
              <List
                header={<div><span>{t("transaction hash")}</span><span className="float-r ml4"><span className="wa-amount"></span>{t("count")}</span><span className="float-r">{t("time")}</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                loading={loading}
                loadMore={loadMore}
                dataSource={translist}
                className="font-s"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Link to={"/" + loacl + "/transaction:" + item.txId} title={t("show detail")}>{item.txId}</Link>}
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

export default Transaction;