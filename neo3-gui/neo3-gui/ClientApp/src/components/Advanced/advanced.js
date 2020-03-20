import React from 'react';
import { Row, Col,Typography,Switch,Skeleton } from 'antd';
import {Link} from 'react-router-dom';

const { Title } = Typography;

class Advanced extends React.Component {
    state = {
        loading: true,
    };
    onChange = (checked,event) => {
        console.log(`switch to ${checked}`);
        //修改传参
    }
    componentDidMount(){
        setTimeout(() => {
            this.setState({ loading: false });
        }, 200);
    }
    render() {
        return (
            <div>
                <Skeleton loading={this.state.loading}>
                    <p>
                        <Link to='/'>
                            回首页
                        </Link>
                    </p>
                    <Title level={4}>链上治理</Title>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                        <Col span={6}>
                            <span>选举</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={6}>
                            <span>投票</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                    </Row>
                    
                    <Title level={4}>开发工具</Title>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                        <Col span={6}>
                            <span>交易签名</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={6}>
                            <span>文本签名</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={6}>
                            <span>构造交易</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={6}>
                            <span>广播交易</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                    </Row>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                        <Col span={6}>
                            <span>数据转换</span>
                            <Switch defaultChecked className="Candidate"
                                // checkedChildren={<Icon type="check" />}
                                // unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={6}>
                            <span>更多功能敬请期待</span>
                        </Col>
                    </Row>
                </Skeleton>
            </div>
        );
    }
}
    

export default Advanced;