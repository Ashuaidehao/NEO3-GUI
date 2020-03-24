/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Input,
    Icon,
    Cascader,
    Modal,
    Select,
    Row,
    Col,
    Form,
    message,
    Menu,
    Button,Drawer 
  } from 'antd';
import {  Layout } from 'antd';
import Sync from '../sync'
import {
    ArrowRightOutlined,
    SearchOutlined 
  } from '@ant-design/icons';

const { Content } = Layout;
const {dialog} = window.remote;


class Searcharea extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      size: 'default',
        path:"",
        disabled:false,
        cname:"search-content"
      };
    }
    componentDidMount() {
        document.addEventListener('click', this.removeClass);
    }
    addClass = (e) =>{
        this.stopPropagation(e);
        this.setState({
            cname:"search-content show-child",
            disabled:true,
        })
    }
    removeClass = () =>{
        if(this.state.disabled){
            this.setState({
                cname:"search-content",
                disabled:false,
            })
        }
    }
    stopPropagation(e) {
        e.nativeEvent.stopImmediatePropagation();
    }
    render = () =>{
    return (
        <div className="search-area">
            <div className="search-btn">
                <SearchOutlined className="inset-btn" onClick={this.addClass}/>
            </div>
            <div className={this.state.cname}>
                <div className="search-detail" ref="sarea" onClick={this.stopPropagation}>
                    <Input 
                    suffix={
                        <ArrowRightOutlined />
                    }></Input>
                    {this.props.show?"点击显示":null}
                    {!this.props.show?"点击隐藏":null}
                </div>
            </div>
        </div>
    );
  }
} 

export default Searcharea;