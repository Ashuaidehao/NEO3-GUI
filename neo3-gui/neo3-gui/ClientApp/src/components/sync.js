
/* eslint-disable */
import React from 'react';
import { Typography } from 'antd';
import 'antd/dist/antd.css';
import {
  SyncOutlined
} from '@ant-design/icons';
import { observer, inject } from "mobx-react";

const { Text } = Typography;

@inject("blockSyncStore")
@observer
class Sync extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p className="ml3 mb0">
          <Text className="t-normal bold"> {this.props.blockSyncStore.syncHeight} / {this.props.blockSyncStore.headerHeight} 区块同步中</Text>
          <SyncOutlined className="ml3" type="sync" spin/> 
        </p>
      </div>
    );
  }
}

export default Sync;