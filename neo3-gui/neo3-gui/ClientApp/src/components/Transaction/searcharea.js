/* eslint-disable */
import React from "react";
import "antd/dist/antd.css";
import axios from "axios";
import { Input, message } from "antd";
import Topath from "../Common/topath";
import { ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

@withTranslation()
class Searcharea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "default",
      path: "",
      disabled: false,
      cname: "search-content",
    };
  }
  addClass = (e) => {
    this.stopPropagation(e);
    this.setState({
      cname: "search-content height-sea show-child",
      disabled: true,
    });
    document.addEventListener("click", this.removeClass);
  };
  removeClass = () => {
    if (this.state.disabled) {
      this.setState({
        cname: "search-content height-sea",
        disabled: false,
      });
    }
    document.removeEventListener("click", this.removeClass);
    setTimeout(
      () =>
        this.setState({
          cname: "search-content",
          disabled: false,
        }),
      500
    );
  };
  stopPropagation(e) {
    e.nativeEvent.stopImmediatePropagation();
  }
  searchContract = () => {
    const { t } = this.props;
    let _hash = this.refs.sinput.input.value.trim();
    if (!_hash) {
      message.info(t("search.check again"));
      return;
    }
    var _this = this;
    axios
      .post("http://localhost:8081", {
        id: "1111",
        method: "GetTransaction",
        params: {
          txId: _hash,
        },
      })
      .then(function (response) {
        var _data = response.data;
        if (_data.msgType === -1) {
          message.info(t("search.check again"));
          return;
        } else if (_data.msgType === 3) {
          _this.setState({ topath: "transaction:" + _hash });
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  };
  render = () => {
    const { t } = this.props;
    return (
      <div className="search-area">
        <Topath topath={this.state.topath}></Topath>
        <div className="search-btn">
          <SearchOutlined className="inset-btn" onClick={this.addClass} />
        </div>
        <div className={this.state.cname}>
          <div
            className="search-detail"
            ref="sarea"
            onClick={this.stopPropagation}
          >
            <Input
              placeholder={t("search.hash-hint")}
              onPressEnter={this.searchContract}
              ref="sinput"
              suffix={<ArrowRightOutlined onClick={this.searchContract} />}
            />
          </div>
        </div>
      </div>
    );
  };
}

export default Searcharea;
