/* eslint-disable */
//just test replace wallet//
import React from 'react';
import { observer, inject } from "mobx-react";
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import { Layout, Row, Col, List, Button, PageHeader, message } from 'antd';
import { withTranslation } from "react-i18next";

import { SwapRightOutlined } from '@ant-design/icons';

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
      limit: 50,
      params: {},
      data: [],
      translist: [],
      loading: true,
      iswa: false,
    };
  }
  componentDidMount() {
    this.setState({
      loacl: location.pathname.split(":").pop()
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
        iswa: false,
        isnpe: true,
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
        isnpe: false,
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
    console.log(params)
    axios.post('http://localhost:8081', {
      "id": "51",
      "method": "QueryTransactions",
      "params": params
    })
    .then(function (response) {
      var _data = response.data;
      if (_data.msgType === -1) {
        console.log(_data)
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
  loadNepMore = () =>{
    this.setState({
      loading: true,
    });
    var _flag = this.madeParams();
    var _params = Object.assign(this.state.params, _flag);
    this.getNeptrans(_params, res => {
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
  render = () => {
    const { t } = this.props;
    const { translist, loacl, loading, iswa,isnpe, page, allpage } = this.state;
    const loadMore = !loading && page <= allpage ? (
      <div className="text-c mb3">
        {iswa ? (<Button type="primary" onClick={this.loadMyMore}>{ t('load more') }</Button>)
        :isnpe ? (<Button type="primary" onClick={this.loadNepMore}>{ t('load more') }</Button>):
        (<Button type="primary" onClick={this.loadMore}>{ t('load more') }</Button>)}
      </div>
    ) : null;
    return (
      <div>
        <Content className="mt3 mb4">
          <Row gutter={[30, 0]} type="flex" style={{ 'minHeight': '120px' }}>
            <Col span={24} className="bg-white pv4">
              <PageHeader title={this.props.content || t("lastest transactions")}></PageHeader>
              <List
                header={<div><span className="succes-light">{t("blockchain.transaction.status")}</span><span>{t("blockchain.transaction info")}</span><span className="float-r">{t("common.time")}</span></div>}
                footer={<span></span>}
                itemLayout="horizontal"
                loading={loading}
                loadMore={loadMore}
                dataSource={translist}
                className="font-s"
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                    title={<span className="succes-light">{t('blockchain.transaction.confirmed')}</span>}
                    />
                    <div className="trans-detail">
                        <p>
                          <Link className="w500 ellipsis hash" to={"/" + loacl + "/transaction:" + item.txId} title={t("show detail")}>{item.txId}</Link>
                          <span className="float-r">{item.blockTime}</span>
                        </p>
                        {item.transfers[0]?
                        <div >
                          <span className="w200 ellipsis">{item.transfers[0].fromAddress ? item.transfers[0].fromAddress : "--"}</span>
                          <SwapRightOutlined />
                          <span className="w200 ellipsis" >{item.transfers[0].toAddress ? item.transfers[0].toAddress : "--"}</span>
                          <span className="float-r"><span className="trans-amount">{item.transfers[0].amount}</span>{item.transfers[0].symbol}</span>
                        </div>
                        :null}
                        {/* // :<div className="font-s"><Tag color="default">Invoke</Tag></div>}  */}
                    </div>
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