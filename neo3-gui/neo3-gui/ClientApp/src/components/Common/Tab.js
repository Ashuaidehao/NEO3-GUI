/* eslint-disable */ 
import React from 'react';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import { Upload,message,Input, Button, Icon } from 'antd';
import { element } from 'prop-types';
import axios from 'axios';
import { Steps } from 'antd';
import Tab from '../Common/Tab'

const remote = window.remote;
const {dialog} = window.remote;

class Tabc extends React.Component{
    constructor (props){
        super(props);
        this.state = {};
    }
    render(){
        return (
            <div>
                <button onClick={this.props.changeTab}>
                    {this.props.content}
                </button>
            </div>
        )
    }
} 

export default Tabc;