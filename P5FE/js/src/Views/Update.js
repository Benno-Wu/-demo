import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, Input, Radio, message } from 'antd';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: {},
      }
    }

    componentWillMount() {
      console.log(`try fetch: beforeUpdate/${this.props.username}`);
      fetch(`http://localhost:8080/P5/beforeUpdate/${this.props.username}`, {
        method: 'POST',
      })
        .then(response => { return response.json(); })
        .then((responseJSON) => {
          console.log(responseJSON);
          if (responseJSON.message.length == 2) {
            console.log('inside');
            console.log('responseJSON: ' + responseJSON.user);
            this.setState({ user: responseJSON.user });
          } else message.error(responseJSON.message);
        })
        .catch(() => message.info('出错了！'));
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate}
          title={`用户：${this.props.username}`} okText="提交" cancelText='取消'
        >
          <Form layout="inline">
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true, },],
                initialValue: this.state.user.name,
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="自我介绍">
              {getFieldDecorator('intro', {
                rules: [{ required: true, },],
                initialValue: this.state.user.intro,
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label='性别' className="collection-create-form_last-form-item">
              {getFieldDecorator('gender', {
                initialValue: this.state.user.gender,
              })(
                <Radio.Group>
                  <Radio value="man">男</Radio>
                  <Radio value="woman">女</Radio>
                  <Radio value='other'>其他</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="城市">
              {getFieldDecorator('city', {
                rules: [{ required: true, },],
                initialValue: this.state.user.city,
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [{ type: 'email', message: '非有效邮箱地址' }, { required: true }],
                initialValue: this.state.user.email,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator('mobile', {
                rules: [{ required: true, },],
                initialValue: this.state.user.mobile,
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="QQ">
              {getFieldDecorator('qq', {
                rules: [{ required: true, },],
                initialValue: this.state.user.qq,
              })(<Input type="textarea" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default class CollectionsPage extends React.Component {
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
      // values.username = 'admin';
      values.username = this.props.username;
      console.log('Received values of form: ', values);
      console.log(`try fetch: update`);
      fetch(`http://localhost:8080/P5/update`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
        >修改个人信息</Button>
        <CollectionCreateForm
          username={this.props.username}
          // username='admin'
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
