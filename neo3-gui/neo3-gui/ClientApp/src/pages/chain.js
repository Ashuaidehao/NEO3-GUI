import React from 'react';
import { Row, Col } from 'antd';

class Chain extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
      <div>
        <Row>
          <Col span={18} push={6}>
            col-18 col-push-6
          </Col>
          <Col span={6} pull={18}>
            col-6 col-pull-18
          </Col>
        </Row>
      </div>
    );
  }
} 

export default Chain;