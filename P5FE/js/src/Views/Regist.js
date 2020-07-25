import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, Input, Radio, message } from 'antd';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate}
          title="创建新用户" okText="创建" cancelText='取消'
        >
          {/* 水平布局失效BUG */}
          <Form layout="horizontal">
            {/* label用于显示，decorator指定JSON字段名，rules中有validator自定义校验 */}
            <Form.Item label="登录用名" >
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入您的用户名！' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }]
              })(<Input type='password' />)}
            </Form.Item>
            <Form.Item label="姓名">
              {getFieldDecorator('name')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="自我介绍">
              {getFieldDecorator('intro')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label='性别' className="collection-create-form_last-form-item">
              {getFieldDecorator('gender', {
                initialValue: 'man',
              })(
                <Radio.Group>
                  <Radio value="man">男</Radio>
                  <Radio value="woman">女</Radio>
                  <Radio value='other'>其他</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {/* <Form.Item label="省份">
              {getFieldDecorator('province')(<Input type="textarea" />)}
            </Form.Item> */}
            <Form.Item label="城市">
              {getFieldDecorator('city')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator('mobile')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="QQ">
              {getFieldDecorator('qq')(<Input type="textarea" />)}
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
      // console.log('Received values of form: ', values);
      // let params = {
      //   userName: values.username,
      //   password: values.password,
      // }
      
      fetch('http://localhost:8080/P5/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(response => { return response.json(); })
        .then((responseJSON) => {
          if (responseJSON.message.length == 2) {
            this.props.history.push('/home', { username: values.username });
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
        >注册</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

// ReactDOM.render(<CollectionsPage />, mountNode);