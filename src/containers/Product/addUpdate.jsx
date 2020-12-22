import {Component} from 'react'
import {Card,Button,Icon,Form,Input,Select, message} from 'antd'
import {connect} from 'react-redux'
import {reqCategory,reqAddProduct, reqProdById,reqUpdateProduct} from '../../api'
import PicUpload from './picUpload'
import RichTextEditor from './richTextEditor'
const {Option} = Select

@connect(state=>({
  cateInfo:state.cateInfo,
  prodInfo:state.prodInfo
}))
@Form.create()
class AddUpdateProd extends Component{
  state={
    categoryId:'',
    categoryList:[],
    name:'',
    desc:'',
    price:'',
    imgs:[],
    detail:'',
    isAdd:true   //true代表新增，false代表修改
  }
  componentDidMount(){
    const {categoryList} = this.props.cateInfo
    const {prodList} = this.props.prodInfo
    if(categoryList.length){
      this.setState({categoryList})
    }else this.getCateList()
    const {id} = this.props.match.params
    if(id){
      //修改
      if(prodList.length){
        let prodResult = prodList.find((item)=>{
          return item._id === id
        })
        this.setState({...prodResult})
        this.refs.picUpload.setImgObj(prodResult.imgs)
        this.refs.richTextEditor.setRichText(prodResult.detail)
      }else{
        this.getProdById(id)
      }
      this.setState({isAdd:false})
    } 
  }
  getCateList = async()=>{
    let result = await reqCategory()
    const {status,data} = result
    if(!status){
      this.setState({categoryList:data})
    }else message.error('获取商品分类失败',1)
  }
  getProdById = async(id)=>{
    let result = await reqProdById(id)
    const {status,data} = result
    if(!status){
      this.setState({...data})
      this.refs.picUpload.setImgObj(data.imgs)
      this.refs.richTextEditor.setRichText(data.detail)
    }else message.error('通过id获取商品信息失败',1)
  }
  handleSubmit = (event)=>{
    event.preventDefault()
    const {id} = this.props.match.params
    let imgs = this.refs.picUpload.getImgArr()
    let detail = this.refs.richTextEditor.getRichText()
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        let result
        if(this.state.isAdd) result = await reqAddProduct({...values,imgs,detail})
        else result = await reqUpdateProduct({...values,imgs,detail,_id:id}) 
        const {status} = result
        if(!status){
          message.success('操作商品成功',1)
          this.props.history.replace('/admin/goods/product')
        }else{
          message.error('操作商品失败',1)
        }
      }else{
        message('表单信息有误',1)
      }
    });
  }
  render(){
    const {getFieldDecorator} = this.props.form
    return (
      <Card title={<div><Button type="link" onClick={this.props.history.goBack}><Icon type="arrow-left" /></Button><span>{this.state.isAdd?'新增':'修改'}商品</span></div>}>
         <Form 
          onSubmit={this.handleSubmit} 
          className="login-form"
          labelCol={{md:2}}
          wrapperCol={{md:10}}
        >
            <Form.Item label="商品名称">
              {
                getFieldDecorator('name', {
                  rules:[{required: true,message: '请输入商品名称',},] ,
                  initialValue:this.state.name || ''  
                })(
                  <Input
                    placeholder="商品名称"
                  />,
                )
              }
            </Form.Item>
            <Form.Item label="商品描述">
              {
                getFieldDecorator('desc', {
                  rules:[{required: true,message: '请输入商品描述',},],
                  initialValue:this.state.desc || '' 
                })(
                  <Input
                    placeholder="商品描述"
                  />,
                )
              }
            </Form.Item>
            <Form.Item label="商品价格">
              {
                getFieldDecorator('price', {
                  rules:[{required: true,message: '请输入商品价格',},],
                  initialValue:this.state.price || '' 
                })(
                  <Input
                    prefix="￥"
                    addonAfter="元"
                    type="number"
                    placeholder="商品价格"
                  />,
                )
              }
            </Form.Item>
            <Form.Item label="商品分类">
              {
                getFieldDecorator('categoryId', {
                  rules:[{required: true,message: '请选择商品分类',},],
                  initialValue:this.state.categoryId || ''
                })(
                  <Select>
                    <Option value="">请选择商品分类</Option>
                    {
                      this.state.categoryList.map((item)=>{
                        return <Option value={item._id} key={item._id}>{item.name}</Option>
                      })
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item label="商品图片" className="ProdImgs">
              <PicUpload ref="picUpload"/>
            </Form.Item>
            <Form.Item label="商品详情" wrapperCol={{md:17}}>
              <RichTextEditor ref="richTextEditor"/>
            </Form.Item>
            <Form.Item>
              <Button style={{height:'38px'}} type="primary" htmlType="submit" className="submitButton">
                提交
              </Button>
            </Form.Item>
          </Form>
      </Card>
    )
  }
}
export default AddUpdateProd