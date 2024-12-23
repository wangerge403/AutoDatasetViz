import { Input, Button, Typography, Card, Tag } from 'antd';
import React from 'react';
import ROSLIB from "roslib";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    MinusCircleOutlined,
  } from '@ant-design/icons';

const { Title } = Typography;

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ip: "",
            port: "",
            status: 'needipport'
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick = () => {
        this.ros = new ROSLIB.Ros({
            url: 'ws://' + this.state.ip + ':' + this.state.port
        });

        this.ros.on('error', () => {
            console.log("on error");
            this.setState({
                status: "error"
            })
        })

        this.ros.on('connection', () => {
            console.log("on connection");
            this.setState({
                status: "isConnected"
            })
        })

        this.props.handle(this.ros)

    }

    handleClick2 = () => {
        this.ros.close()
        this.setState({
            status: "needipport"
        })
    }

    render() {
        return (
            <div style={{}}>
                <Card title="请连接websocket服务器" bordered={false} 
                hoverable={true} style={{ width: 800,height: 400 }}>
                    <div align='center' style={{ marginTop:20, marginBottom:20}}>
                        <span>连接状态：</span>
                        {
                            this.state.status === 'isConnected' && (
                                <Tag icon={<CheckCircleOutlined />} color="success">连接成功</Tag>
                            )
                        }{
                            this.state.status === 'needipport' && (
                                <Tag icon={<MinusCircleOutlined />} color="default">
                                    服务器连接已断开
                                </Tag>
                            )
                        }{
                            this.state.status === 'error' && (
                                <Tag icon={<CloseCircleOutlined />} color="error">
                                    ip地址或端口错误
                                </Tag>
                            )
                        }
                        <br />
                        <Input.Group compact style={{marginTop: 50}}>
                            <Input addonBefore="ws://" addonAfter=":" placeholder='服务ip地址' style={{ width: 400 }} name='ip' onChange={this.handleChange} />
                            <Input placeholder='端口号' addonAfter="" style={{ width: 120 }} name='port' onChange={this.handleChange} />
                            {
                                this.state.status === 'error' && (
                                    <Button type="primary" onClick={this.handleClick}>连接</Button>
                                )
                            }
                            {
                                this.state.status === 'needipport' && (
                                    <Button type="primary" onClick={this.handleClick}>连接</Button>
                                )
                            }
                            {
                                this.state.status === 'isConnected' && (
                                    <Button type="primary" onClick={this.handleClick2}>断开连接</Button>
                                )
                            }
                        </Input.Group>
                    </div>
                </Card>
                <Title level={3} align='center'></Title>
            </div >
        )
    }
}



export { Home }