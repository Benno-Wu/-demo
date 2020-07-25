import React from 'react';
import { Layout, Button, Card, Icon, Input, List, Modal, message } from "antd";
import { BigImg, Link } from './Views';
import BlackCheck from "../Controller/BlackCheck";

const image = require('.././image/moon/moon1.png');
const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

export default class Search_ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            pictures: [],
            picturess: [],
        }
        this.keywords = this.props.location.state.keywords;
        this.users = [];
        this.pictures = [];
    }

    componentWillMount() {
        console.log(`try fetch: search/${this.props.location.state.keywords}`);
        fetch(`http://localhost:8080/P5/search/${this.props.location.state.keywords}`, {
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
                    console.log('responseJSON: ' + responseJSON.users);
                    this.users = responseJSON.users;
                    this.pictures = responseJSON.pictures;
                    this.setState({ users: this.users, pictures: this.pictures });
                } else message.error(responseJSON.message);
            })
            .catch(() => message.info('出错了！'));

        console.log(`try fetch: searchPics/${this.props.location.state.keywords}`);
        fetch(`http://localhost:8080/P5/searchPics/${this.props.location.state.keywords}`, {
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
                    console.log('responseJSON: ' + responseJSON);
                    this.setState({ picturess: responseJSON.pictures });
                } else message.error(responseJSON.message);
            })
            .catch(() => message.info('出错了！'));
    }

    render() {
        return (
            <div>
                <Result history={this.props.history}
                    users={this.state.users}
                    pictures={this.state.pictures}
                    picturess={this.state.picturess}
                    er={this.props.location.state.er} />
            </div>
        );
    }
}

class Result extends React.Component {
    constructor(props) {
        super(props);
        // this.extra = this.extra.bind(this);
    }

    // componentDidMount() {
    //     console.log("this.users", this.users);
    // }

    render() {
        return (
            <Layout style={{ backgroundColor: 'grey' }}>
                <Header style={{ minHeight: 200, backgroundColor: 'lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Search
                        placeholder="想搜啥" size="large" enterButton="GO"
                        onSearch={value => {
                            if (value.length < 1) { message.info("请输入关键词") }
                            else this.props.history.replace('/search', { keywords: value })
                        }} />
                </Header>
                <Content style={{ minHeight: 500, justifyItems: 'center' }}>
                    <List dataSource={this.props.users}
                        renderItem={item => (
                            <List.Item style={{ margin: 20, }}
                                extra={this.extra()} >
                                <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span>用户名：<Button type='link' onClick={() => {
                                        callback = callback.bind(this);
                                        function callback(result) {
                                            message.error(result+'1');
                                            if (result)
                                                this.props.history.push('/space', { username: item.username, key: 1, er: this.props.er });
                                        }
                                        BlackCheck(item.username, this.props.er, callback);
                                        // if (BlackCheck(item.username, this.props.er))
                                        //     this.props.history.push('/space', { username: item.username, key: 1, er: this.props.er });
                                    }}>{item.username}</Button> </span>
                                    性别：{item.gender}<br />城市：{item.city}<br />
                                    已上传照片：{item.pictures} <br />关注：{item.concerer}<br /> 粉丝：{item.concerned}
                                    {/* <Button type="link" style={{ color: 'blue' }}
                                        onClick={() => { message.info('出错了~') }}
                                    >关注</Button> */}
                                </div>
                            </List.Item>
                        )} />
                    图片结果：<br />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {this.pics()}
                    </div>
                    {/* 水平布局BUG */}
                    {/* <List dataSource={this.props.picturess} itemLayout="horizontal"
                        renderItem={item => (
                            <List.Item style={{ margin: 20, }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <BigImg src={image} />
                                    照片名：{item.fname}<br />上传人：{item.username}
                                </div>
                            </List.Item>
                        )} /> */}
                </Content>
            </Layout>
        );
    }

    extra() {
        let extras = [];
        for (let i = 0; i < this.props.pictures.length; i++) {
            extras.push(
                <div>
                    <BigImg src={image} />
                    照片名：{this.props.pictures[i].fname}
                </div>
            );
        }
        return extras;
    }
    pics() {
        let extras = [];
        for (let i = 0; i < this.props.picturess.length; i++) {
            extras.push(
                <div style={{ margin: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <BigImg src={image} />
                    照片名：{this.props.pictures[i].fname}
                </div>
            );
            if (i % 5 == 0) {
                extras.push(<br />);
            }
        }
        return extras;
    }
}
