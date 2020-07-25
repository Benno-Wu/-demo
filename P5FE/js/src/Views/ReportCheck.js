import React from "react";
import { List, message, Icon, Spin, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

export default class ReportCheck extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentWillMount() {
        this.fetchData();
    }

    fetchData() {
        console.log(`try fetch: reportCheck`);
        fetch(`http://localhost:8080/P5/reportCheck`, {
            method: 'POST',
        })
            .then(response => { return response.json(); })
            .then((responseJSON) => {
                console.log(responseJSON);
                if (responseJSON.message.length == 2) {
                    console.log('inside');
                    this.setState({ data: responseJSON.reports });
                } else message.error(responseJSON.message);
            })
            .catch(() => message.info('出错了！'));
    }

    handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData(res => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    };

    render() {
        return (
            <div style={{ borderWidth: 1, borderRadius: 10, overflow: 'auto', padding: 8, height: 300 }}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    // loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}>
                    <List bordered={true} size='large'
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={<a onClick={() =>
                                        this.props.history.push('/space', { username: item.username, key: 0, er: this.props.username })
                                    }>{item.username}</a>}
                                    description={item.reason}
                                />
                                <Button type='ghost' onClick={() => {
                                    fetch(`http://localhost:8080/P5/reportDelete/${item.id}`, {
                                        method: 'POST',
                                    })
                                        .then(response => { return response.json(); })
                                        .then((responseJSON) => {
                                            console.log(responseJSON);
                                            if (responseJSON.message.length == 2) {
                                                this.fetchData();
                                                message.info(responseJSON.message);
                                            } else message.error(responseJSON.message);
                                        })
                                        .catch(() => message.info('出错了！'));
                                }}>删除</Button>
                            </List.Item>
                        )}>
                        {/* 为什么不会转 */}
                        {this.state.loading && this.state.hasMore && (
                            <div style={{ textAlign: 'center' }}>
                                <Spin spinning={true} tip='Loading...' />
                            </div>)}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}
