import {Component} from 'react'
import {Card,Button,Icon,List,message} from 'antd'
import {connect} from 'react-redux'
import {reqProdById,reqCategory} from '../../api'
import './css/detail.less'
const {Item} = List
@connect(state=>({prodInfo:state.prodInfo,cateInfo:state.cateInfo}))
class ProdDetail extends Component{
  state={
    categoryId:'',
    categoryName:'',
    desc:'',
    detail:'',
    imgs:[],
    name:'',
    price:''
  }
  componentDidMount(){
    const prodId = this.props.match.params.id
    const {prodList} = this.props.prodInfo
    const {categoryList} = this.props.cateInfo
    if(prodList.length){
      let result = prodList.find(item=> item._id === prodId) 
      const {categoryId,desc,detail,imgs,name,price} = result
      this.categoryId = categoryId
      this.setState({categoryId,desc,detail,imgs,name,price:price+''})
    }else  this.getProdById(prodId)
    
    if(categoryList.length){
      let result = categoryList.find(item=>item._id === this.categoryId)
      this.setState({categoryName:result.name})
    }else this.getCategory()
  }
  getProdById=async(id)=>{
    let result = await reqProdById(id)
    const {status,data} = result
    if(status === 0){
      const {categoryId,desc,detail,imgs,name,price} = data
      this.categoryId = categoryId
      this.setState({categoryId,desc,detail,imgs,name,price:price+''})
    }else{
      message.warning('错误',1)
    }
  }
  //发送请求时间差可能出现问题
  getCategory= async()=>{
    let result = await reqCategory()
    const {status,data} = result
    if(status === 0){
      let result1 = data.find(item=>item._id === this.categoryId)
      this.setState({categoryName:result1.name})
    }else{
      message.warning('错误',1)
    }
  }
  render(){
    return (
      <Card title={<span><Button type='link' onClick={this.props.history.goBack}><Icon type="arrow-left" /></Button><span>商品详情</span></span>}>
        <List className="prodList">
          <Item>
            <span className="oneProd">商品名称:</span>
            <span>{this.state.name}</span>
          </Item>
          <Item>
            <span className="oneProd">商品描述:</span>
            <span>{this.state.desc}</span>
          </Item>
          <Item>
            <span className="oneProd">商品价格:</span>
            <span>{this.state.price}</span>
          </Item>
          <Item>
            <span className="oneProd">所属分类:</span>
            <span>{this.state.categoryName}</span>
          </Item>
          <Item>
            <span className="oneProd">商品图片:</span>
              {
                this.state.imgs.map((item)=>{
                  return (   
                    <img key={item} src={'/upload/'+item} alt="商品图片" style={{width:'200px',height:'200px'}}/>
                  )
                })
              }
          </Item>
          <Item>
            <span className="oneProd">商品详情:</span>
            <span className='prodDetail' dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
export default ProdDetail

