/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import '../../static/css/trans.css';
import axios from 'axios';
import { Alert , Input,
    Tooltip,
    Icon,
    Cascader,
    Modal,
    Drawer,
    Select,
    Row,
    Col,
    message,
    Button,
    AutoComplete,
  } from 'antd';
  
import {  Layout } from 'antd';
import Intitle from '../Common/intitle'
import '../../static/css/wallet.css'
import { Form, DatePicker, TimePicker } from 'antd';

const { Option } = Select;
const { Content } = Layout;
const AutoCompleteOption = AutoComplete.Option;

const {dialog} = window.remote;

const { MonthPicker, RangePicker } = DatePicker;

class Datatrans extends React.Component{
    constructor (props){
        super(props);
        this.state = {};
    }
    render(){
        return (
            <Drawer
                title="Data Transform"
                width={400}
                placement="right"
                closable={false}
                onClose={this.props.onClose}
                visible={this.props.visible}
                getContainer={false}
                style={{ position: 'absolute' }}
            >
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
                <Input placeholder="请输入要转到 NEO3 地址" />
            </Drawer>
        )
    }
} 

export default Datatrans;