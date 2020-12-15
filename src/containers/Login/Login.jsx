import {Component} from 'react'
import { Form, Input, Button,message,Icon} from 'antd';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {saveUserInfoAction} from '../../redux/actions/userInfo.js'
import {reqLogin} from '../../api'
import logo from '../../static/images/logo.jpg'
import './css/Login.less'

@connect((state)=>state.userInfo,{
  saveUserInfo:saveUserInfoAction
})
@Form.create()
class Login extends Component{
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        const {username,password} = values
        let result = await reqLogin(username,password)
        const {status,msg,data} = result
        if(status === 0){
          this.props.saveUserInfo(data)
          this.props.history.replace('/admin')
        }else{
          message.warning(msg,1)
        }
      }else{
        console.log(err)
      }
    });
  };
  render(){
    const {isLogin} = this.props
    const { getFieldDecorator } = this.props.form;
    if(!isLogin){
      return (
        <div className="login">
          <header>
            <img src={logo} alt="logo"/>
            <h2>商品管理</h2>
          </header>
          <section>
            <h1>用户登录</h1>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {
                  getFieldDecorator('username', {
                    rules:[
                      {required: true,message: '请输入用户名',},
                      {max: 12, message: '用户名必须小于等于12位'},
                      {min: 4, message: '用户名必须大于等于4位'},
                      {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
                    ]   
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Username"
                    />,
                  )
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('password', {
                    rules:[
                      {required: true,message: '请输入密码',},
                      {max: 12, message: '密码必须小于等于12位'},
                      {min: 4, message: '密码必须大于等于4位'},
                      {pattern: /^\w+$/, message: '密码必须是字母、数字、下划线组成'},
                    ]   
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Password"
                    />,
                  )
                }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
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
export default Login