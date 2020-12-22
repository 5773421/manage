import {Component} from 'react'
import {Button, Card,Icon,Select,Input,Table,message} from 'antd'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { reqProductList,reqUpdateProdStatus,reqSearchProd} from '../../api'
import {PRODUCTPAGESIZE} from '../../config'
import {createUpdateProdList} from '../../redux/actions/product.js'
const {Option} = Select
@connect(()=>({}),{
  updateProdList:createUpdateProdList
})
class Product extends Component{
  state = {
    productList:[],
    total:0,
    current:1,
    searchType:'productName',
    searchKey:'',
    isLoading:true
  }
  componentDidMount(){
    this.getProductList()
    this.isChange = false
  }
  //通过名字或描述搜索分页列表
  search = ()=>{
    this.isSearch = true
    this.getProductList()
  }
  //获取商品列表
  getProductList=async(num=1)=>{
    let result
    this.setState({isLoading:true})
    if(this.isSearch){
      result = await reqSearchProd(num,PRODUCTPAGESIZE,this.state.searchType,this.state.searchKey)
    }else{
      result = await reqProductList(num,PRODUCTPAGESIZE)
    }
    if(!result.status){
      const {list,total,pageNum} = result.data
      this.setState({productList:list,total,current:pageNum,isLoading:false})
      this.props.updateProdList(list)
    }else{
      message.error('获取商品列表失败',1)
    } 
  }
  //商品上下架
  updateStatus=async(productId,status)=>{
    if(status===1) status = 2
    else status = 1
    let result = await reqUpdateProdStatus(productId,status)
    let productList = [...this.state.productList]
    if(result.status === 0){
      productList = productList.map((item)=>{
        if(item._id === productId) item.status = status
        return item
      })
      this.setState({productList})
    } 
    else message.error('修改商品状态失败',1)
  }

  render(){
    const dataSource = this.state.productList
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width:'25%'
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width:'8%',
        align:'center'
      },
      {
        title: '状态',
        //dataIndex: 'status',
        key: 'status',
        width:'8%',
        align:'center',
        render:(item)=>{
          return (
            <div>
              <Button 
                type={item.status===1?'danger':'success'}
                onClick={()=>{this.updateStatus(item._id,item.status)}}
              >{item.status===1?'下架':'上架'}
              </Button><br/>
              <span>{item.status===1?'在售':'已下架'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: '_id',
        key: 'opera',
        width:'8%',
        align:'center',
        render:(_id)=>{
          return (
            <div>
              <Link to={'/admin/goods/product/add_update/'+_id}><Button type="link">修改</Button><br/></Link>
              <Link to={"/admin/goods/product/detail/"+_id}><Button type="link">详情</Button></Link>
            </div>
          )
        }
      }
    ];
    return (
      <Card title={
        <div>
          <Select defaultValue="productName" onChange={(value)=>{this.setState({searchType:value})}}>
            <Option value="productName">按名称搜索</Option>
            <Option value="productDesc">按描述搜索</Option>
          </Select>
          <Input onChange={(event)=>{this.setState({searchKey:event.target.value})}} style={{width:"15%",margin:'0 10px'}} placeholder="搜索关键字"/>
          <Button onClick={this.search}>搜索</Button>
        </div>
      } extra={<Link to="/admin/goods/product/add_update"><Button type="primary"><Icon type="plus" />新增商品</Button></Link>}
      >
        <Table dataSource={dataSource} 
          columns={columns} 
          bordered 
          loading={this.state.isLoading}
          pagination={{
            total:this.state.total,
            pageSize:PRODUCTPAGESIZE,
            current:this.state.current,
            onChange:this.getProductList,
            showQuickJumper:true
          }}
          rowKey='_id'
        />;
      </Card>
    )
  }
}
export default Product