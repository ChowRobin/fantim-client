import React from 'react';
import store from '../../utils/Store';
import {genConversationId} from '../../utils/Message'
import '../../css/app.css';
import {Modal, Form, Input, Button, Checkbox } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import {generalFetch, openNotification} from '../../utils/Utils';
import {userApi} from '../../utils/GlobalConfig'

const {domain, action} = userApi

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.areaRef = React.createRef();

        this.handleCancel = this.handleCancel.bind(this);
        this.state =  {
            ModalText: '注册账号',
            visible: false,
            confirmLoading: false,
        };

    }

    handleCancel () {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    doSignUp() {

    }
  

    render() {
        //注意：在数组中使用Spread syntax（扩展语法）注意要判 `null | undefined`
        //参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Only_for_iterables
        const { state } = this.props;


        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
        const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
        };
          
        const onFinish = values => {

            let userId = parseInt(values.userId)
            if (isNaN(userId) || userId == 0) {
                openNotification('账户ID填写错误', '请重试') 
                return
            }
            generalFetch(
                domain+action.signUp,
                {user_id: userId, nickname: values.nickname, password: values.password},
                (result) => {
                   if (result.status_code == 0){
                       openNotification('注册成功', '欢迎登陆系统')
                    } else {
                       openNotification('操作失败', '请稍后重试')
                    }
                    
                }
            )

            this.setState({visible:false})
        };
          
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return <div >
            <a type="link" onClick={(e) => this.setState({visible:true})}>
                没有账号？注册一下
            </a>
            <Modal
                    title="注册一下"
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    footer={[]}
                    closable={false}
                    onCancel={this.handleCancel}
                >
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            label="账号ID"
                            name="userId"
                            rules={[{ required: true, message: '纯数字' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="昵称"
                            name="nickname"
                            rules={[{ required: true, message: '请输入昵称' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
            </Modal>
                 
        </div>;
     }
}