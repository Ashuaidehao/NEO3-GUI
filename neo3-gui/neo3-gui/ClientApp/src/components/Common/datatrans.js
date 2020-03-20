/* eslint-disable */
import React from 'react';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
import '../../static/css/trans.css';
import '../../static/js/bundledemo.js';
import axios from 'axios';
import {
    Alert, Input,
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

import { Layout } from 'antd';
import Intitle from '../Common/intitle'
import '../../static/css/wallet.css'
import DataConvert from "./dataConverter";

import { SwapOutlined } from '@ant-design/icons';
import { constants } from 'fs';


class Datatrans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            outstr: "",
            outhexstr: "",
            outhash: "",
            outbighash: "",
            outbigadd: ""
        };
        this.convert=new DataConvert();
        let address= this.convert.toAddress("0xf9df308b7bb380469354062f6b73f9cb0124317b");
        console.log(address);
    }
    componentDidMount() {
    }
    hexToString = (hex) => {
        var trimhex = hex.trim();
        var rawStr = trimhex.substr(0, 2).toLowerCase() === "0x" ? trimhex.substr(2) : trimhex;
        var len = rawStr.length;
        if (len % 2 !== 0) {
            message.error("Illegal Format ASCII Code!");
            return "";
        }
        var cuChar;
        var result = [];
        for (var i = 0; i < len; i = i + 2) {
            cuChar = parseInt(rawStr.substr(i, 2), 16);
            result.push(String.fromCharCode(cuChar));
        }
        return result;
    };
    stringToHex = (str) => {
        if (str === "")
            return "";
        var hexChar = [];
        for (var i = 0; i < str.length; i++) {
            hexChar.push((str.charCodeAt(i)).toString(16));
        }
        return hexChar;
    }
    stringTrans = () => {
        let instr = document.getElementById("inString").value;
        if (instr) {
            var _outStr = this.hexToString(instr);
            this.setState({
                outstr: _outStr
            })
        }
        let inhexstr = document.getElementById("inHexString").value;
        if (inhexstr) {
            var _outhexstr = this.stringToHex(inhexstr).join("");
            this.setState({
                outhexstr: _outhexstr
            })
        }
    }
    endianTrans = () => {
        let inhash = document.getElementById("inHash").value.replace(/(^\s*)|(\s*$)/g, "");
        if (inhash.length !== 40 && inhash.length !== 42) {
            message.error("输入格式错误，请检查后再次输入！");
            return;
        }

        var result = [], num;
        if (inhash.indexOf("0x") == 0) {
            inhash = inhash.slice(2);
        } else if (inhash) {
            result = ['0x'];
        }

        var hashArray = inhash.hexToBytes().reverse();
        for (var i = 0; i < hashArray.length; i++) {
            num = hashArray[i];
            if (num < 16) {
                num = hashArray[i].toString(16);
                num = "0" + num;
            } else { num = hashArray[i].toString(16); }
            result.push(num);
        }
        let _outhash = result.join("");
        this.setState({
            outhash: _outhash
        })
    }
    // bigTrans = () =>{
    //     var _this = this;
    //     var inbighash = document.getElementById("inBigHash").value.replace(/(^\s*)|(\s*$)/g, "");
    //     if (inbighash) {
    //         if(inbighash.substr(0, 2)=="0x")inbighash = inbighash.slice(2);
    //         if(inbighash.length!=40){alert("Illegal Format Script Hash!");return;}
    //         var hash160 = Neo.Uint160.parse(inbighash);
    //         Neo.Wallets.Wallet.toAddress(hash160).then(function (val) {
    //             _this.setState({
    //                 outbighash: val
    //             })
    //         });
    //     }
    //     var inbigadd = document.getElementById("inBigAddress").value.replace(/(^\s*)|(\s*$)/g, "");
    //     if (inbigadd) {
    //         if(inbigadd.length!=34){message.error("输入的格式错误，请检查后再试");return;}
    //         Neo.Wallets.Wallet.toScriptHash(inbigadd).then(function (val) {
    //             _this.setState({
    //                 outbigadd: val.toString()
    //             })
    //         });
    //     }
    // }


    render() {
        return (
            <Drawer
                title="Data Transform"
                width={500}
                placement="right"
                closable={false}
                onClose={this.props.onClose}
                visible={this.props.visible}
                getContainer={false}
                style={{ position: 'absolute' }}
            >
                <ul className="trans-ul">
                    <li>
                        <p className="trans-title">String <SwapOutlined className="small" /> Hex String</p>
                        <p className="trans-area">
                            <label>Hex String:</label><Input id="inString" type="text" placeholder="7472616e73666572" />
                            <label>String:</label><span id="outString" className="trans-text">{this.state.outstr}</span><br />
                        </p>
                        <p className="trans-area">
                            <label>String:</label><Input id="inHexString" type="text" placeholder="transfer" />
                            <label>Hex String:</label><span id="outHexString" className="trans-text">{this.state.outhexstr}</span><br />
                        </p>
                        <p className="text-r">
                            <Button type="primary" onClick={this.stringTrans}>Transform</Button>
                        </p>
                    </li>
                    <li>
                        <p className="trans-title">Script Hash (Big-endian <SwapOutlined className="small" /> Little-endian)</p>
                        <p className="trans-area">
                            <label>Big / Little:</label><Input id="inHash" type="text" placeholder="0xbc99b2a477e28581b2fd04249ba27599ebd736d3" />
                            <label>Result:</label><span className="trans-text">{this.state.outhash}</span><br />
                        </p>
                        <p className="text-r">
                            <Button type="primary" onClick={this.endianTrans}>Transform</Button>
                        </p>
                    </li>
                    {/* <li>
                        <p className="trans-title">Address (big endian) <SwapOutlined className="small"/> Script Hash</p>
                        <p className="trans-area">
                            <label>Script Hash:</label><Input id="inBigHash" type="text" placeholder="0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9" value="0xecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9"/>
                            <label>Address:</label><span className="trans-text">{this.state.outbighash}</span><br />
                        </p>
                        <p className="trans-area">
                            <label>Address:</label><Input id="inBigAddress" type="text" placeholder="AeV59NyZtgj5AMQ7vY6yhr2MRvcfFeLWSb"/>
                            <label>Script Hash:</label><span className="trans-text">{this.state.outbigadd}</span><br />
                        </p>
                        <p className="text-r">
                            <Button type="primary" onClick={this.bigTrans}>Transform</Button>
                        </p>
                    </li>
                    <li>
                        <p className="trans-title">Address (little endian) <SwapOutlined className="small"/> Hex String</p>
                        <p className="trans-area">
                            <label>Hex String:</label><Input id="inScriptHash" type="text" placeholder="7472616e73666572"/>
                            <label>String:</label><span id="outScriptHash" className="trans-text">transfer</span><br />
                        </p>
                        <p className="trans-area">
                            <label>String:</label><Input id="inAddress" type="text" placeholder="transfer"/>
                            <label>Hex String:</label><span id="outAddress" className="trans-text"> </span><br />
                        </p>
                        <p className="text-r">
                            <Button type="primary">Transform</Button>
                        </p>
                    </li>
                    <li>
                        <p className="trans-title">Number <SwapOutlined className="small"/> Hex Number</p>
                        <p className="trans-area">
                            <label>Hex Number:</label><Input id="inHexNum" type="text" placeholder="00e1f505"/>
                            <label>Number:</label><span id="outHexNum" className="trans-text">transfer</span><br />
                        </p>
                        <p className="trans-area">
                            <label>Number:</label><Input id="inNum" type="Number" placeholder="transfer"/>
                            <label>Hex String:</label><span id="outNum" className="trans-text"> </span><br />
                        </p>
                        <p className="text-r">
                            <Button type="primary">Transform</Button>
                        </p>
                    </li> */}
                </ul>
            </Drawer>
        )
    }
}

export default Datatrans;