import {Component} from 'react'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {reqLogin} from '../../api'

import logo from './images/logo.jpg'
import './css/Login.less'

class Login extends Component{
  onFinish = (values) => {
    const {username,password} = values
    reqLogin(username,password)
    .then((result)=>{
      console.log(result)
    })
    .catch((reason)=>{
      console.log(reason)
    })
  }
  pwdValidator = (rule,value,callback)=>{
    if(!value){
      callback('密码必须输入')
    }else if(value.length>12){
      callback('密码必须小于等于12位')
    }else if(value.length<4){
      callback('密码必须大于等于4位')
    }else if(!(/^\w+$/).test(value)){
      callback('密码必须是字母、数字、下划线组成')
    }else{
      callback()
    }
  }
  render(){
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h2>商品管理</h2>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {required: true,message: 'Please input your Username!',},
                {max: 12, message: '用户名必须小于等于12位'},
                {min: 4, message: '用户名必须大于等于4位'},
                {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  validator:this.pwdValidator
                 },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button  type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}


export default connect((state)=>({testnum:state.testnum}))(Login)