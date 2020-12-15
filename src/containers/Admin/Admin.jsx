import {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect,Switch,Route} from 'react-router-dom'
import {Layout} from 'antd'

import {deleteUserInfoAction} from '../../redux/actions/userInfo'
import {reqCategory} from '../../api'
import Header from './Header/Header'
import Home from '../../components/Home/Home'
import Category from '../Category/Category'
import Product from '../Product/Product'
import User from '../User/User'
import Role from '../Role/Role'
import Bar from '../Bar/Bar'
import Line from '../Line/Line'
import Pie from '../Pie/Pie'
import MenuLeft from './MenuLeft/MenuLeft'
import './css/Admin.less'

const {Footer,Sider,Content} = Layout
@connect((state)=>state.userInfo,{
  deleteUserInfo:deleteUserInfoAction
})
class Admin extends Component{
  categoryList = async()=>{
    let result = await reqCategory()
    console.log(result)
  }
  render(){
    const {isLogin} = this.props
    if(isLogin){
      return (
        <Layout className = "admin">
          <Sider width="250" className="sider">
            <MenuLeft/>
          </Sider>
          <Layout>
            <Header></Header>
            <Content className="content">
              <Switch>
                <Route path="/admin/home" component={Home}/>
                <Route path="/admin/goods/category" component={Category}/>
                <Route path="/admin/goods/product" component={Product}/>
                <Route path="/admin/user" component={User}/>
                <Route path="/admin/role" component={Role}/>
                <Route path="/admin/charts/bar" component={Bar}/>
                <Route path="/admin/charts/line" component={Line}/>
                <Route path="/admin/charts/pie" component={Pie}/>
                <Redirect to="/admin/home"/>
              </Switch>
            </Content>
            
            <Footer className="footer">推荐使用谷歌浏览器，以获得最佳体验</Footer>
          </Layout>
        </Layout>
      )
    }else{
      return <Redirect to="/login"/>
    }
  }
}
export default Admin