import React, { Component } from 'react';
import { Input, Modal, Form, Button, message } from 'antd';

const NormalForm = Form.create({ name: 'form_in_modal' })(
    class extends Component {
        constructor(props) {
            super(props);
        }
        state = {
            confirmDirty: false,
        };

        handleConfirmBlur = e => {
            const { value } = e.target;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        };

        compareToFirstPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && value !== form.getFieldValue('newPW')) {
                callback('两次密码不一致');
            } else {
                callback();
            }
        };

        validateToNextPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        };

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div>
                    <Modal style={{ display: 'flex', justifyContent: 'stretch' }}
                        visible={visible} onCancel={onCancel} onOk={onCreate}
                        title="修改密码" okText="确认" cancelText='取消'>
                        <Form layout='inline'>
                            <Form.Item label="原密码：" >
                                {getFieldDecorator('oldPW', {
                                    rules: [{ required: true, message: '请输入旧密码', },]
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="新密码：" hasFeedback>
                                {getFieldDecorator('newPW', {
                                    rules: [{ required: true, message: '请输出新密码', },
                                    { validator: this.validateToNextPassword, }]
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="确认密码：" hasFeedback>
                                {getFieldDecorator('confirm', {
                                    rules: [{ required: true, message: '二次确认输入', },
                                    { validator: this.compareToFirstPassword, }]
                                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            );
        }
    }
);

// const WrappedNormalForm = Form.create({ name: 'normal' })(NormalForm);
export default class WrappedNormalForm extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(`username=${this.props.username}&oldPW=${values.oldPW}&newPW=${values.newPW}`);
            console.log('Received values of form: ', values);
            fetch(`http://localhost:8080/P5/changePW/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `username=${this.props.username}&oldPW=${values.oldPW}&newPW=${values.newPW}`,
            })
                .then(response => { return response.json(); })
                .then((responseJSON) => {
                    console.log(responseJSON);
                    if (responseJSON.message.length == 2) {
                        console.log('inside');
                        message.info(responseJSON.message);
                    } else message.error(responseJSON.message);
                })
                .catch(() => message.info('出错了！'));

            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}
                >修改密码</Button>
                <NormalForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}