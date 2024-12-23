import React from "react";
import { Row, Col, Typography, Space, AutoComplete, Button, Card } from "antd"
import ROSLIB from "roslib"

const { Title } = Typography;

class RawImage extends React.Component {

    constructor(props) {
        super(props);
        this.optionsTopic = [
            {
                value: '/hmi/image',
            }
        ];
        this.optionsMsg = [
            {
                value: 'sensor_msgs/CompressedImage',
            }
        ];
        this.ros = new ROSLIB.Ros({
            url: 'ws://localhost:9090'
        });

        this.state = {
            topicName: "/hmi/image",
            msgType: "sensor_msgs/CompressedImage",
            isConnected: false
        }
    }

    handleChange = (e) => {
        this.setState({
            topicName: e
        })
    }

    handleClick = () => {
        this.image = document.getElementById('image');
        this.listener_image = new ROSLIB.Topic({
            ros: this.ros,
            name: this.state.topicName,
            messageType: 'sensor_msgs/CompressedImage'
        });
        this.listener_image.subscribe(this.handleMsg)
    }

    handleMsg = (message) => {
        this.setState({
            isConnected: true
        })
        this.image.src = 'data:image/jpeg;base64,' + message.data;
    }

    componentDidMount() {
        this.image = document.getElementById('image');
        this.listener_image = new ROSLIB.Topic({
            ros: this.ros,
            name: this.state.topicName,
            messageType: 'sensor_msgs/CompressedImage'
        });
    }

    render() {
        return (
            <div>
                <Card>
                <Row>
                    <Col span={14}>
                        <div style={{fontSize: 24}}>图像显示：</div>
                        <div align="center" style={{ height: "auto",width: "800px", paddingTop: 100, border:"1px solid #ccc", borderRadius:'8px' }}>
                            <img id="image" style={{ width: "90%" }}></img>
                        </div>
                    </Col>
                    <Col span={10} style={{ paddingTop: 0 }}>
                        { !this.state.isConnected &&
                            <Title level={2} align="center">
                                请输入话题名称及消息类型进行订阅
                            </Title>
                        }
                        { this.state.isConnected &&
                            <Title level={2} type="success" align="center">
                                订阅原始图像消息成功！
                            </Title>
                        }
                        <div style={{ marginTop: 50 }}>
                            {/* <Col span={10} offset={1}>
                                <Space direction="vertical">
                                    <Title level={5}> 话题名称: </Title>
                                    <Title level={5}> 消息类型: </Title>
                                </Space>

                            </Col> */}

                            <div>
                                <Title level={5}> 话题名称: </Title>
                                <AutoComplete
                                    style={{
                                        width: 300,
                                    }}
                                    options={this.optionsTopic}
                                    placeholder="请输入原始图像话题名称"
                                    onChange={this.handleChange}
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </div>
                            <div>
                                <Title level={5}> 消息类型: </Title>
                                <AutoComplete
                                    style={{
                                        width: 300,
                                    }}
                                    options={this.optionsMsg}
                                    placeholder="请输入原始图片消息类型"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </div>
                        </div>
                        <br />
                        <Row>
                            <Col offset={8}>
                                <Button type="primary" style={{width: "200px", }} onClick={this.handleClick}>订阅消息</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </Card>
            </div>
        )
    }

}

export { RawImage }