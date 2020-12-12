import {Component} from 'react'
import { Form, Input, Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {reqLogin} from '../../api'
import {Redirect} from 'react-router-dom'

import {saveUserInfoAction} from '../../redux/actions/userInfo.js'

import logo from './images/logo.jpg'
import './css/Login.less'

class Login extends Component{
  onFinish = async (values) => {
    const {username,password} = values
    let result = await reqLogin(username,password)
    const {status,msg,data} = result
    if(status === 0){
      this.props.saveUserInfo(data)
      this.props.history.replace('/admin')
    }else{
      message.warning(msg,1)
    }
  }
  render(){
    const {isLogin} = this.props
    if(!isLogin){
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
                  {required: true,message: '请输入用户名',},
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
                  {required: true,message: '请输入用户名',},
                  {max: 12, message: '用户名必须小于等于12位'},
                  {min: 4, message: '用户名必须大于等于4位'},
                  {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
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
    }else{
      return <Redirect to="/admin"/>
    } 
  }
}


export default connect((state)=>state.userInfo,{
  saveUserInfo:saveUserInfoAction
})(Login)