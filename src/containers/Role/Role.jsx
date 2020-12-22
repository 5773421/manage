import {Component} from 'react'
import {Card,Button,Form,Input,Modal, message,Table,Tree} from 'antd'
import dayjs from 'dayjs'
import {connect} from 'react-redux'
import {reqAddRole,reqRoleList,reqUpdateRoleAuth} from '../../api'
import {ROLEPAGESIZE} from '../../config'
import categoryList from '../../config/menu-config.js'
const {TreeNode} = Tree
@connect(state=>({userName:state.userInfo.user.username}))
@Form.create()
class Role extends Component{
  state = {
    addVisible:false,
    roleList:[],
    authVisible:false,
    checkedKeys: [],
    roleId:''
  }
  componentDidMount(){
    this.getRoleList()
  }
  getRoleList = async()=>{
    let result = await reqRoleList()
    const {status,data,msg} = result
    if(!status) this.setState({roleList:data.reverse()})
    else message.error(msg,1)
  }
  addRoleShow = ()=>{
    this.setState({addVisible:true})
  }
  setAuthShow = (item)=>{
    this.setState({authVisible:true,roleId:item._id,checkedKeys:item.menus})
  }
  hideModalOk = (event)=>{
    event.preventDefault()
    this.props.form.validateFields(async(err, values) => {
      if(err) {message.error('表单信息填写错误',1); return}
      else{
        let result = await reqAddRole(values)
        const {status,data,msg} = result
        const roleList = [...this.state.roleList]
        if(!status) {
          message.success('新增角色成功',1)
          roleList.unshift(data)
          this.setState({roleList})
        }
        else message.error(msg,1)
      }
    });
    this.setState({addVisible:false})
  }
  //设置权限弹窗点击确定
  hideModalAuthOk = async()=>{
    const {roleId,checkedKeys} = this.state
    const {userName} = this.props
    console.log(checkedKeys)
    let result = await reqUpdateRoleAuth({_id:roleId,menus:checkedKeys,auth_name:userName})
    const {status,msg} = result
    if(!status){
      message.success('角色授权成功',1)
      this.setState({authVisible:false})
      this.getRoleList()
    }else message.error(msg,1)
  }
  //设置权限弹窗点击返回
  hideModalAuthCancel = ()=>{
    this.setState({authVisible:false})
  }
  hideModalCancel = ()=>{
    this.setState({addVisible:false})
  }
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });
  render(){
    const {getFieldDecorator} = this.props.form
    const dataSource = this.state.roleList
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align : 'center',
        render: time=> dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        align : 'center',
        render: time =>time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : ''
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        key: 'opera',
        align : 'center',
        render: (item)=>{
          return (
            <Button type="link" onClick={()=>{this.setAuthShow(item)}}>设置权限</Button>
          )
        }
      },
    ];
    const treeData = categoryList
    return (
      <div>
        <Card title={<Button type="primary" onClick={this.addRoleShow}>添加角色</Button>}>
          <Table 
          dataSource={dataSource} 
          columns={columns} 
          rowKey="_id" 
          pagination={{
            pageSize:ROLEPAGESIZE,
            showQuickJumper:true
          }} 
          bordered
        />

        </Card>
        <Modal
          title="添加角色"
          visible={this.state.addVisible}
          onOk={this.hideModalOk}
          onCancel={this.hideModalCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="角色名称：">
            {
              getFieldDecorator('roleName', {
                rules:[
                  {required: true,message: '请输入角色名',},
                ]   
              })(
                <Input
                  placeholder="请输入角色名"
                />,
              )
            }
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={this.state.authVisible}
          onOk={this.hideModalAuthOk}
          onCancel={this.hideModalAuthCancel}
          okText="确认"
          cancelText="取消"
        >
           <Tree
            checkable
            onCheck={this.onCheck}
            defaultExpandAll={true}
            checkedKeys={this.state.checkedKeys}
          >
            <TreeNode title='平台权限' key='all'>
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>
        </Modal>
      </div>
    )
  }
}
export default Role