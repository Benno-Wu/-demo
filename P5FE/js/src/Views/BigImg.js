import React from 'react';
import { Modal, } from 'antd';

export default class BigImg extends React.Component {
    constructor(props) {
        super(props);
        this.info = this.info.bind(this);
    }

    render() {
        return (
            <div onClick={this.info}>
                <img alt='加载失败'
                    style={{ pointerEvents: 'none', height: 150, width: 150 }}
                    src={this.props.src}
                ></img>
            </div>
        );
    };

    info() {
        Modal.info({
            width: 512 + 100,
            title: '查看大图',
            content: (
                <div>
                    <img alt='加载失败'
                        style={{ height: 512, width: 512 }}
                        src={this.props.src}
                    ></img>
                </div>
            ),
            onOk() { },
        });
    }
}
