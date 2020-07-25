import React from "react";
import { Form, Icon, Input, Button, message, } from 'antd';
import { Regist } from "./Views";

const styles = {
    login_form: {
        maxWidth: 300,
    },
}

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // let params = {
                //     userName: values.username,
                //     password: values.password,
                // }
                let params = values;
                // console.log(formData.get('username'));
                fetch('http://localhost:8080/P5/login', {
                    method: 'POST',
                    // mode: 'cors',
                    headers: {
                        // "Content-Type": "application/x-www-form-urlencoded"
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                    // body: params,
                })
                    .then(response => {
                        // if (response.ok) {
                        return response.json();
                        // } else {
                        // return Promise.reject({
                        //     status: response.status,
                        //     statusText: response.statusText
                        // })
                        // }
                    })
                    .then((responseJSON) => {
                        // console.log(responseJSON.message);
                        if (responseJSON.message.length == 2) {
                            this.props.history.push('/home', { username: values.userName });
                        } else message.error(responseJSON.message);
                        // console.log("Login Success");
                    })
                    .catch(error => {
                        message.info('出错了！');
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={styles.login_form}>
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item style={{ float: "left" }}>
                    <Button type="primary" htmlType="submit" style={styles.login_form}
                    >登录</Button>
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                    <Regist />
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default class Login extends React.Component {
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 80, margin: 10 }}>简单图片管理系统</span>
                <WrappedNormalLoginForm history={this.props.history} />
            </div>
        );
    }
}
// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);