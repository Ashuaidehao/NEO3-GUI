import React from 'react';
import { Layout, Row, Col,Input  } from 'antd';
import {Link} from 'react-router-dom';

const { Content } = Layout;
const { Search } = Input;

class Chain extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render(){
    return (
          <Layout>
            {/* <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Icon type="radius-setting" />
                <span>区块</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="swap" />
                <span>交易</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="dollar" />
                <span>资产</span>
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="snippets" />
                <span>合约</span>
              </Menu.Item>
            </Menu>
          </Sider> */}
            <Content style={{ margin: '12px 15px 0', overflow: 'initial' }}>
              <Row>
                <Col span={6}>
                  {/* <Icon className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle} /> */}
                </Col>
                <Col span={18} className='text-r'>
                  <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    style={{ width: 200 }} />
                </Col>
              </Row>
              <Row>
                <Link to='/'>
                  回首页
                </Link>
              </Row>
            </Content>
        </Layout>
    );
  }
} 

export default Chain;