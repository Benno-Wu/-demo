import React from 'react';
import { Button, message } from 'antd';

export default class Link extends React.Component {
    constructor(props) {
        super(props);
        this.link = this.link.bind(this);
    }

    render() {
        return (
            <Button type='danger' onClick={this.link}
            >{this.props.title}</Button>
        );
    };

    link() {
        // console.log('linkKey', this.props.linkKey);
        // console.log('er', this.props.er);
        
        if (this.props.linkKey == '0') {
            let params = {
                concerner: this.props.er,
                concerned: this.props.ed,
            }
            console.log(`try fetch: concern/`);
            fetch(`http://localhost:8080/P5/concern`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            })
                .then(response => { return response.json(); })
                .then((responseJSON) => {
                    console.log(responseJSON);
                    if (responseJSON.message.length == 2) {
                        console.log('inside');
                        message.info('关注成功！')
                    } else message.error(responseJSON.message);
                })
                .catch(() => message.info('出错了！'));
        } else {
            let params = {
                blacker: this.props.er,
                blacked: this.props.ed,
            }
            console.log(`try fetch: black/`);
            fetch(`http://localhost:8080/P5/black`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            })
                .then(response => { return response.json(); })
                .then((responseJSON) => {
                    console.log(responseJSON);
                    if (responseJSON.message.length == 2) {
                        console.log('inside');
                        message.info('屏蔽成功！')
                    } else message.error(responseJSON.message);
                })
                .catch(() => message.info('出错了！'));
        }
    }
}
