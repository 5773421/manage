import {Component} from 'react'
import {Table,Button,Modal,Card,Icon,Input,Form, message} from 'antd'
import {reqCategory,reqUpdateCategory,reqAddCategory} from '../../api'
import {connect} from 'react-redux'
import {createSaveCateListAction} from '../../redux/actions/category.js'

@connect(state=>({}),{
  saveCategoryList:createSaveCateListAction  
})
@Form.create()
class Category extends Component{
  state = {
    categoryList:[], //请求获取到的分类列表
    visible:false,//弹窗是否显示
    handleType:'',//要操作的类型
    modalTitle:'',//弹窗标题
    currentName:'',//此时操作的商品name
    currentId:'',//此时操作的商品Id
    loading:true
  }
  componentDidMount(){
    this.reqCateList()
  }
  reqCateList = async()=>{
    let result = await reqCategory()
    const {status,data,msg} = result
    if(status === 0){
      this.setState({categoryList:data.reverse(),loading:false})
      this.props.saveCategoryList(data)
    }else{
      message.error(msg,1)
    }
  }
  toUpdate=async(currentName)=>{
    let result = await reqUpdateCategory(this.state.currentId,currentName)
    const {status,msg} = result
    if(status === 0){
      message.success('商品分类修改成功',1)
      this.reqCateList()
      this.setState({visible:false})
      this.props.form.resetFields() //重置表单，遗留问题，当点击确定了以后，再点击别的按钮文字不对应。所以重置下表单
    }else{
      message.error(msg,1)
    }
  }
  toAdd = async(currentName)=>{
    let result = await reqAddCategory(currentName)
    const {status,data,msg} = result
    let categoryList = [...this.state.categoryList]
    if(status === 0){
      categoryList.unshift(data)
      message.success('新增分类成功',1)
      this.setState({visible:false,
        categoryList
      })
      this.props.saveCategoryList(data)
      this.props.form.resetFields()
    }else{
      message.error(msg,1)
    }
  }
  //点击确定
  hideModalOk = ()=>{
    const {handleType} = this.state
    this.props.form.validateFields((err,values)=>{
      if(err){
        message.warning('表单数据输入有误，请检查',1)
        return
      }
      const {title} = values
      if(handleType==='add'){ //新增分类
        this.toAdd(title)
      }else if(handleType === 'update'){//修改分类
        this.toUpdate(title)
      }
    })
  }
  //点击返回
  hideModalCancel = ()=>{
    this.setState({visible:false})
  }
  //添加分类的弹窗展示
  addShow=()=>{
    this.setState({visible:true,
      modalTitle:'新增分类',
      initialValue:'',
      handleType:'add'
    })
  }
  //修改分类的弹窗展示
  updataShow=(item)=>{
    const {_id,name} = item
    this.setState({
      visible:true,
      modalTitle:'修改分类',
      currentName:name,
      currentId:_id,
      handleType:'update'
    })
  }


  render(){
    const dataSource = this.state.categoryList
    const {getFieldDecorator} = this.props.form
    const {currentName,loading} = this.state
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width:'25%',
        render:(item)=>{return <Button type="link" onClick={()=>{this.updataShow(item)}}>修改分类</Button>}
      },
    ];
    return (
      <div>
        <Card extra={<Button type="primary" onClick={this.addShow}><Icon type="plus" /> 添加</Button>} >
          <Table loading={loading} dataSource={dataSource} columns={columns} bordered={true} rowKey='_id'
          pagination={{defaultPageSize:7,showQuickJumper:true}}/>
        </Card>
        <Modal
          title={this.state.modalTitle}
          visible={this.state.visible}
          onOk={this.hideModalOk}
          onCancel={this.hideModalCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form className="Category-form">
              <Form.Item>
                {
                  getFieldDecorator('title', {
                    initialValue:currentName,
                    rules:[
                      {required: true,message: '请输入分类名称',},
                    ]   
                  })(
                    <Input
                      prefix={''}
                      placeholder="请输入分类名称"
                    />,
                  )
                }
              </Form.Item>
            </Form>
        </Modal>
      </div>   
    )
  }
}
export default Category