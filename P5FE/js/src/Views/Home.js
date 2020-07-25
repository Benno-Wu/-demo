import React from 'react';
import { Layout, Button, Card, Icon, Input, List, Modal, Upload, message } from "antd";
import { BigImg, Report, ReportCheck } from "./Views";
import BlackCheck from "../Controller/BlackCheck";

const image = require('.././image/moon/moon1.png');
const { Header, Footer, Sider, Content } = Layout;
const { Dragger } = Upload;
const { Search } = Input;

const props = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:8080/P5/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
        } else if (status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    },
};

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 9,
            user: {},
            pictures: [],
        }
        this.username = this.props.location.state.username;
        this.user = {};
        this.pictures = [];
    }

    componentWillMount() {
        console.log(`try fetch: home/${this.props.location.state.username}?page=${this.state.page}&size=${this.state.size}`);
        fetch(`http://localhost:8080/P5/home/${this.props.location.state.username}`, {
            method: 'POST',
            headers: {
                // "Content-Type": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            // body: JSON.stringify(params),
            body: `page=${this.state.page}&size=${this.state.size}`,
        })
            .then(response => { return response.json(); })
            .then((responseJSON) => {
                console.log(responseJSON);
                if (responseJSON.message.length == 2) {
                    console.log('inside');
                    // let user = JSON.parse(responseJSON.user);
                    console.log('responseJSON: ' + responseJSON.user);
                    console.log('user: ' + responseJSON.user.intro);
                    this.user = responseJSON.user;
                    this.pictures = responseJSON.pictures;
                    this.setState({ user: this.user, pictures: this.pictures });
                } else message.error(responseJSON.message);
            })
            .catch(() => message.info('出错了！'));
    }

    render() {
        return (
            <div>
                <NoHome history={this.props.history}
                    username={this.username}
                    pictures={this.state.pictures} />
            </div>
        );
    }
}

class NoHome extends React.Component {
    render() {
        return (
            <Layout style={{ backgroundColor: 'grey' }}>
                <Header style={{ minHeight: 200, backgroundColor: 'lightgrey' }}>
                    <div style={{ Height: 200, Width: 200, float: 'left', display: 'flex', flexDirection: 'row' }}>
                        <BigImg src={image} />
                        <div >
                            <Button type="link"
                                onClick={() => this.props.history.push('/space', { username: this.props.username, key: 0 })}
                            >{this.props.username}的空间</Button>
                            <div style={{ display: 'flex', flexDirection: 'row' }}
                            ><Uploader /><Report /></div>
                        </div>
                    </div>
                    <Search
                        placeholder="想搜啥" size="large" enterButton="GO"
                        onSearch={value => {
                            if (value.length < 1) { message.info("请输入关键词") }
                            else this.props.history.push('/search', { keywords: value, er: this.props.username })
                        }} />
                </Header>
                <Content style={{ minHeight: 500, justifyItems: 'center' }}>
                    <List
                        grid={{ gutter: 3, column: 3 }}
                        dataSource={this.props.pictures}
                        renderItem={item => (
                            <List.Item style={{ margin: 20, }}>
                                <div style={{ Height: 200, Width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <BigImg src={image} />
                                    照片名：{item.fname}
                                    <Button type="link" style={{ color: 'blue' }}
                                        onClick={() => {
                                            // message.info(BlackCheck(item.username, this.props.username)+'');
                                            // BlackCheck(item.username,this.props.username).then((a)=>message.info(a+''));
                                            callback = callback.bind(this);
                                            function callback(result) {
                                                // message.error(result+'123');
                                                if (result)
                                                    this.props.history.push('/space', { username: item.username, key: 1, er: this.props.username });
                                            }
                                            BlackCheck(item.username, this.props.username, callback);
                                        }}
                                    >上传人：{item.username}</Button>
                                </div>
                            </List.Item>
                        )} />
                </Content>
                <div style={{ display: 'flex', }}>
                    <Button.Group size='default'>
                        <Button type="primary"
                            onClick={() => { message.info('出错了~') }}
                        ><Icon type="left" />上一页</Button>
                        <Button type="primary"
                            onClick={() => { message.info('出错了~') }}
                        >下一页<Icon type="right" /></Button>
                    </Button.Group>
                </div>
                {this.adminsFoot()}
            </Layout>
        );
    }

    adminsFoot() {
        return this.props.username != 'admin' ? < div /> :
            <Footer>
                用户举报管理：<ReportCheck username='admin' history={this.props.history} />
            </Footer>;
    }
}

class Uploader extends React.Component {
    state = { visible: false };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <Button type="primary" icon="upload" onClick={this.showModal}
                >上传图片</Button>
                <Modal
                    title="上传图片" okText="关闭" visible={this.state.visible} closable={false}
                    onOk={this.handleOk} cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon"><Icon type="inbox" /> </p>
                        <p className="ant-upload-text">点击或拖拽至区域内</p>
                        <p className="ant-upload-hint">自动上传</p>
                    </Dragger>
                </Modal>
            </div>
        );
    }
}