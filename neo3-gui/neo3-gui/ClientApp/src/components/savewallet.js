import React from 'react';
import { Icon , Typography } from 'antd';
import 'antd/dist/antd.css';
import {
  HomeOutlined
} from '@ant-design/icons';
import { observer, inject } from "mobx-react";


const { Text } = Typography;


@inject("blockSyncStore")
@observer
class Savewallet extends React.Component{
  constructor(props){
    super(props);
  }
 
  render(){
    return (
      <div>
        <p>
          <Icon type="sync" spin/> 
          <Text type="secondary"> {this.props.blockSyncStore.syncHeight} / {this.props.blockSyncStore.height} </Text>
          <Text>区块同步中</Text>
        </p>
      </div>
    );
  }
} 

export default Savewallet;