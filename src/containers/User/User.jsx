import {Component} from 'react'
import {Card,Table,Button, message,Form,Modal,Input,Select} from 'antd'
import {USERPAGESIZE} from '../../config'
import {reqUserList,reqAddUser,reqUpdateUser} from '../../api'
import dayjs from 'dayjs'
const {Option} = Select

@Form.create()
class User extends Component{
  state = {
    roles:[],
    users:[],
    isShow:false,
    _id:'',
    username:'',
    create_time:'',
    role_id:'',
    phone:'',
    email:'',
    isAdd:true
  }
  componentDidMount(){
    this.getUserList()
  }
  addUserShow = ()=>{
    this.setState({isShow:true,username:'',phone:'',role_id:'',email:'',_id:'',create_time:'',isAdd:true})
    this.props.form.resetFields()
  }
  updateUserShow = (item)=>{
    this.setState({...item,isAdd:false,isShow:true})
  }
  //添加用户确定
  hideModalOk = (event)=>{
    event.preventDefault()
    this.props.form.validateFields(async(err, values) => {
        let result
        if(this.state.isAdd){
          result = await reqAddUser(values)
          const {status,data,msg} = result
          if(!status){
            const users = [...this.state.users]
            users.unshift(data)
            this.setState({users})
            message.success('操作用户成功',1)
          }else message.error(msg,1)
        } 
        else{
          console.log(values)
          result = await reqUpdateUser({...values,_id:this.state._id})
          const {status,msg} = result
          if(!status){
            this.getUserList()
            message.success('操作用户成功',1)
          }else message.error(msg,1)
        }  
    });
    this.setState({isShow:false})
  }
  hideModalCancel = ()=>{
    this.setState({isShow:false})
  }
  getUserList = async()=>{
    let result = await reqUserList()
    const {status,data,msg} = result
    if(!status){
      this.setState({roles:data.roles,users:data.users.reverse()})
    }else message.error(msg,1)
  }
  passwordRender = ()=>{
    const {getFieldDecorator} = this.props.form
    return (
      <Form.Item label="密码" labelCol={{md:3}} wrapperCol={{md:15}}>
        {
          getFieldDecorator('password', {
            rules:[
              {required: true,message: '请输入密码',},
              {max: 12, message: '密码必须小于等于12位'},
              {min: 4, message: '密码必须大于等于4位'},
              {pattern: /^\w+$/, message: '密码必须是字母、数字、下划线组成'},
            ],
            initialValue:'' 
          })(
            <Input
              type="password"
              placeholder="密码"
            />,
          )
        }
      </Form.Item>
    )
  }
  
  render(){
    const dataSource = this.state.users
    const {getFieldDecorator} = this.props.form
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex:'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        key: 'create_time',
        dataIndex:'create_time',
        align : 'center',
        render:(time) => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '所属角色',
        key: 'role_id',
        align : 'center',
        render:(item) => this.state.roles.find((role)=> role._id === item.role_id).name
      },
      {
        title: '操作',
        key: 'opera',
        align : 'center',
        render:(item)=>{
          return (
            <span>
              <Button type="link" onClick={()=>{this.updateUserShow(item)}}>修改</Button>
              <Button type="link">删除</Button>
            </span>
          )
        }
      },
    ];
    return (
      <div>
        <Card title={<Button type="primary" onClick={this.addUserShow}>创建用户</Button>}>
          <Table
          dataSource={dataSource} 
          columns={columns} 
          rowKey="_id" 
          pagination={{
            pageSize:USERPAGESIZE,
            showQuickJumper:true
          }} 
          bordered
        />
        </Card>
        {/* 新增用户模态框 */}
        <Modal
          title="添加角色"
          visible={this.state.isShow}
          onOk={this.hideModalOk}
          onCancel={this.hideModalCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form onSubmit={this.hideModalOk}>
            <Form.Item label="用户名" labelCol={{md:3}} wrapperCol={{md:15}}>
              {
                getFieldDecorator('username', {
                  rules:[
                    {required: true,message: '请输入用户名',},
                    {max: 12, message: '用户名必须小于等于12位'},
                    {min: 4, message: '用户名必须大于等于4位'},
                    {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
                  ],
                  initialValue:this.state.username
                })(
                  <Input
                    placeholder="用户名"
                  />,
                )
              }
            </Form.Item>
            {
              this.state.isAdd?this.passwordRender():''
            }
            <Form.Item label="手机号" labelCol={{md:3}} wrapperCol={{md:15}}>
              {
                getFieldDecorator('phone', {
                  rules:[
                    {required: true,message: '请输入手机号',}
                  ],
                  initialValue:this.state.phone
                })(
                  <Input
                    placeholder="手机号"
                  />,
                )
              }
            </Form.Item>
            <Form.Item label="邮箱" labelCol={{md:3}} wrapperCol={{md:15}}>
              {
                getFieldDecorator('email', {
                  rules:[
                    {required: true,message: '请输入邮箱',}
                  ],
                  initialValue:this.state.email
                })(
                  <Input
                    placeholder="邮箱"
                  />,
                )
              }
            </Form.Item>
            <Form.Item label="角色" labelCol={{md:3}} wrapperCol={{md:15}}>
              {
                getFieldDecorator('role_id', {
                  rules:[
                    {required: true,message: '角色为必选项',}
                  ],
                  initialValue:this.state.role_id
                })(
                  <Select>
                    <Option value="">请选择角色</Option>
                    {
                      this.state.roles.map((role)=>{
                        return <Option value={role._id} key={role._id}>{role.name}</Option>
                      })
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default User