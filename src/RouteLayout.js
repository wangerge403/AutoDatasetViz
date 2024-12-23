import { Layout, Menu, Typography } from 'antd';
import { LinkOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import React from 'react';
import { Outlet, Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const {Title} = Typography;


class RouteLayout extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            home: true,
            current: 1
        }
    }

    render() {
        return (
            <Layout style={{ height: window.innerHeight, width: window.innerWidth }}>
                <Header style={{background: "#000"}} className="header" height={150}>
                    {/* <Title style={{color:"white", }}>Web2ROS 自动驾驶可视化平台</Title> */}
                    <div style={{color:"white", fontSize: "36px",fontWeight:"bold", fontStyle: "italic"}}>Web2ROS 自动驾驶可视化平台</div>
                </Header>
                <Layout>

                    <Sider width={240} className="site-layout-background">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <SubMenu key="sub1" icon={<LinkOutlined />} title="连接配置">
                                <Menu.Item key="1"><Link to="/">连接服务器</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<NotificationOutlined />} title="订阅ROS消息">
                                {/* <Menu.Item key="2"><Link to="position">定位结果</Link></Menu.Item> */}
                                {/* <Menu.Item key="3"><Link to="pointcloud">原始点云</Link></Menu.Item> */}
                                <Menu.Item key="4"><Link to="rawimage">原始图像</Link></Menu.Item>
                                {/* <Menu.Item key="5"><Link to="hmi_data">认知模型</Link></Menu.Item> */}
                            </SubMenu>
                            {/* <SubMenu key="sub3" icon={<LaptopOutlined />} title="可视化显示">
                                <Menu.Item key="9"><Link to="baidumap">全局认知模型</Link></Menu.Item>
                                <Menu.Item key="10"><Link to="hdmap">局部认知模型</Link></Menu.Item>
                            </SubMenu> */}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export { RouteLayout }