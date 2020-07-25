import React, { Component } from 'react';
import { Input, Modal, Form, Button, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const NormalForm = Form.create({ name: 'form_in_modal' })(
    class extends Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <div>
                    <Modal style={{ display: 'flex', justifyContent: 'stretch' }}
                        visible={visible} onCancel={onCancel} onOk={onCreate}
                        title="举报" okText="确认" cancelText='取消'>
                        <Form layout='vertical'>
                            <Form.Item label="用户：">
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名！' }],
                                })(<Input type="textarea" />)}
                            </Form.Item>
                            <Form.Item label="理由：">
                                {getFieldDecorator('reason', {
                                    rules: [{ required: true, message: '请输入理由' }],
                                })(<TextArea autoSize={{ minRows: 2 }} />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            );
        }
    }
);

export default class Report extends React.Component {
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

            console.log('Received values of form: ', values);
            fetch(`http://localhost:8080/P5/report/${values.username}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `reason=${values.reason}`,
            })
                .then(response => { return response.json(); })
                .then((responseJSON) => {
                    console.log(responseJSON);
                    if (responseJSON.message.length == 2) {
                        console.log('inside');
                        console.log('responseJSON: ' + responseJSON);
                        message.info('举报成功！');
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
                <Button type='danger' onClick={this.showModal}
                    style={{ margin: 10 }}
                >举报用户</Button>
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