import React from 'react';
import {
    PageHeader,
    Button,
    Row,
    Col,
    Layout } from 'antd';
import Sync from '../sync';
import "../../static/css/advanced.css";
import Datatrans from '../Common/datatrans';
import { SwapOutlined, PaperClipOutlined } from '@ant-design/icons';


const { shell } = window.electron;
const { Content } = Layout;

class Advanced extends React.Component {
        constructor(props){
        super(props);
        this.state = {
            visible: false
        };
    }
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    openUrl (url) {
        return ()=>{
            shell.openExternal(url);
        }
    }
    render() {
        return (
            <Layout className="gui-container">
            <Sync />
            <Content className="mt3">
              <Row gutter={[30, 0]} style={{ 'minHeight': 'calc( 100vh - 120px )' }}>
                <Col span={24} className="bg-white pv4">
                    <PageHeader title="GUI 工具"></PageHeader>
                    <Row className="mt3" gutter={[30, 0]}>
                        <Col span={6}>
                            <Button className="ml3" type="primary" onClick={this.showDrawer}><SwapOutlined /> 数据转换</Button>
                        </Col>
                    </Row>
                    <PageHeader className="mt2" title="开发者工具"></PageHeader>
                    <Row className="mt3" gutter={[30, 0]}>
                        <Col span={6}>
                            <a className="ml3" onClick={this.openUrl("https://neowish.ngd.network/neo3/")}><PaperClipOutlined /> 测试币申请</a>
                        </Col>
                        <Col span={6}>
                            <a className="ml3" onClick={this.openUrl("https://docs.neo.org/")}><PaperClipOutlined /> 开发者文档</a>
                        </Col>
                        <Col span={6}>
                            <a className="ml3" onClick={this.openUrl("https://neo.org/dev")}><PaperClipOutlined /> 更多</a>
                        </Col>
                    </Row>
                </Col>
              </Row>
            <Datatrans visible={this.state.visible} onClose={this.onClose} />   
            </Content>
          </Layout>
        );
    }
}
    

export default Advanced;