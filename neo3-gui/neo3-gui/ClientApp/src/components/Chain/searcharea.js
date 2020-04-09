/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input,message} from 'antd';
import Topath from '../Common/topath';
import {
    ArrowRightOutlined,
    SearchOutlined 
  } from '@ant-design/icons';
import { withTranslation } from "react-i18next";

@withTranslation()
class Chainsearch extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
        path:"",
        disabled:false,
        cname:"search-content"
      };
    }
    addClass = (e) =>{
      this.stopPropagation(e);
      this.setState({
        cname:"search-content height-sea show-child",
        disabled:true,
      })
      document.addEventListener('click', this.removeClass);
    }
    removeClass = () =>{
      if(this.state.disabled){
        this.setState({
          cname:"search-content height-sea",
          disabled:false,
        })
      }
      document.removeEventListener('click', this.removeClass);
      setTimeout(() => this.setState({
        cname:"search-content",
        disabled:false,
      }),500)
    }
    stopPropagation(e) {
        e.nativeEvent.stopImmediatePropagation();
    }
    searchChain = () => {
      const { t } = this.props;
      let _this = this;
      
      let _height = Number((this.refs.sinput.input.value).trim());
      if(!_height){message.info(t('search.check again'));return;}

      axios.post('http://localhost:8081', {
        "id": "1111",
        "method": "GetBlock",
        "params": {
          "index": _height
        }
      })
      .then(function (response) {
        var _data = response.data;
        console.log(_data)
        if (_data.msgType === -1) {
          message.info(t('blockchain.height unexist'));
          return;
        }else{
          _this.setState({topath:"/chain/detail:"+_height});
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
    }
    render = () =>{
    const { t } = this.props;
    return (
        <div className="search-area">
            <Topath topath={this.state.topath}></Topath>
            <div className="search-btn">
                <SearchOutlined className="inset-btn" onClick={this.addClass}/>
            </div>
            <div className={this.state.cname}>
                <div className="search-detail" ref="sarea" onClick={this.stopPropagation}>
                    <Input
                    placeholder={t("search.chain-hint")}
                    onPressEnter={this.searchChain}
                    ref="sinput"
                    suffix={<ArrowRightOutlined onClick={this.searchChain}/>}
                    />
                </div>
            </div>
        </div>
    );
  }
} 

export default Chainsearch;