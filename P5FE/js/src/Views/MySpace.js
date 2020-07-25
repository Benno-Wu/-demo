import React from 'react';
import { Layout, Button, Card, Icon, Input, List, message } from "antd";
import { Update, PasswordChange, BigImg, Link, ReportCheck } from "./Views";

const image = require('.././image/moon/moon1.png');
const { Header, Footer, Sider, Content } = Layout;
const { Search, TextArea } = Input;

export default class MySpace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 9,
            user: {},
            pictures: [],
            delete: false,
        }
        this.username = this.props.location.state.username;
        this.user = {};
        this.pictures = [];
    }

    componentWillMount() {
        if (this.props.location.state.key != 0)
            this.setState({ delete: true });
    }

    componentDidMount() {
        console.log(`try fetch: space/${this.props.location.state.username}?page=${this.state.page}&size=${this.state.size}`);
        fetch(`http://localhost:8080/P5/space/${this.props.location.state.username}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `page=${this.state.page}&size=${this.state.size}`,
        })
            .then(response => { return response.json(); })
            .then((responseJSON) => {
                console.log(responseJSON);
                if (responseJSON.message.length == 2) {
                    console.log('inside');
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
            <Layout style={{ backgroundColor: 'grey' }}>
                <Header style={{ minHeight: 200, backgroundColor: 'lightgrey' }}>
                    <div style={{ Height: 200, Width: 200, float: 'left', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <BigImg src={image} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div>
                                {this.state.user.username}<br />
                                {this.state.user.intro}<br />
                                {/* {this.state.user.gender}<br />
                                {this.state.user.city} */}
                            </div>
                            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' }}>
                                <Button type="link"
                                    onClick={() => { message.info('出错了~') }}
                                >关注{this.state.user.concerer}</Button>
                                <Button type="link"
                                    onClick={() => { message.info('出错了~') }}
                                >粉丝{this.state.user.concered}</Button>
                            </div>
                            {this.link()}
                            {this.extra()}
                        </div>
                    </div>
                    <Search
                        placeholder="想搜啥" size="large" enterButton="GO"
                        onSearch={value => {
                            if (value.length < 1) { message.info("请输入关键词") }
                            else this.props.history.push('/search', { keywords: value })
                        }} />
                </Header>
                <Content style={{ minHeight: 500, justifyItems: 'center' }}>
                    <List
                        grid={{ gutter: 3, column: 3 }}
                        dataSource={this.state.pictures}
                        renderItem={item => (
                            <List.Item style={{ margin: 20, }}>
                                <div style={{ Height: 200, Width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <BigImg src={image} />
                                    照片名：{item.fname}
                                    <Button type='primary' disabled={this.state.delete}
                                        onClick={() => { message.info('出错了~') }}
                                    >删除</Button>
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
            </Layout>
        );
    }

    extra() {
        return this.props.location.state.key == 1 ? <div /> :
            <div>
                <TextArea rows={4} value='test' />
                <span style={{ display: 'flex', flexDirection: 'row' }} >
                    <Button type="primary"
                        onClick={() => { message.info('出错了~') }}
                    >修改签名</Button>
                    <Button type="primary"
                        onClick={() => { message.info('出错了~') }}
                    >修改头像</Button>
                    <Update username={this.username} />
                    <PasswordChange username={this.username} />
                </span>
            </div>;
    }
    link() {
        return this.props.location.state.key == 0 ? <div /> :
            <div>
                {/* {message.info(this.props.location.state.er)} */}
                <Link title='屏蔽' linkKey='1' er={this.props.location.state.er}
                    ed={this.props.location.state.username}></Link><br />
                <Link title='关注' linkKey='0' er={this.props.location.state.er}
                    ed={this.props.location.state.username}></Link>
            </div>;
    }
}
