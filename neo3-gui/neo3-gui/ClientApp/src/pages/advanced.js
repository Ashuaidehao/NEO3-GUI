import React from 'react';
import { Row, Col,Typography,Switch,Icon,Skeleton } from 'antd';
import {Link} from 'react-router-dom';

const { Title } = Typography;
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

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
        }, 1000);
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
                    <Row type="flex" justify="space-between" align="top">
                        <Col span={4}>
                            选举
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={4}>
                            投票
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                    </Row>
                    
                    <Title level={4}>开发工具</Title>
                    <Row type="flex" justify="space-between" align="top">
                        <Col span={4}>
                            交易签名
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={4}>
                            文本签名
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={4}>
                            构造交易
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={4}>
                            广播交易
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={4}>
                            数据转换
                            <Switch defaultChecked className="Candidate"
                                checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />}
                                onChange={this.onChange}/>
                        </Col>
                        <Col span={4}>
                            更多功能敬请期待
                        </Col>
                    </Row>
                </Skeleton>
            </div>
        );
    }
}
    

export default Advanced;