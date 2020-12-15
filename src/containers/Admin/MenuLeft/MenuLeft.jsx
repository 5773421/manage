import {Component} from 'react'
import {Menu,Icon} from 'antd'
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import './css/MenuLeft.less'
import logo from '../../../static/images/logo.jpg'
import categoryList from '../../../config/menu-config.js'
import {createUpdateTitleAction} from '../../../redux/actions/menu'
const {SubMenu} = Menu 

@connect(state=>({}),{
  updateTitle:createUpdateTitleAction
})
@withRouter
class MenuLeft extends Component{
  updateTitleFun = (value)=>{
    this.props.updateTitle(value)
  }
  //通过递归动态添加菜单列表
  addCategory = (List)=>{
    return List.map((item)=>{
      if(item.children instanceof Array){
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.addCategory(item.children)}
          </SubMenu>
        )
      }else{
        return (
          <Menu.Item key={item.key} onClick={()=>{this.updateTitleFun(item.title)}}>
            <Link to={item.path}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }
    })
  }
  render(){
    const routePath = this.props.history.location.pathname.split('/').splice(2).reverse()
    const selectKey = routePath[0]
    return (
      <div className="menuLeft">
        <div className="menuTop">
          <img className="logo" src={logo} alt="logo"/>
          <span>商品管理</span>
        </div>
        <Menu
          defaultSelectedKeys={selectKey}
          defaultOpenKeys={routePath}
          mode="inline"
          theme="dark"
        >
          {this.addCategory(categoryList)}
        </Menu>
      </div>
    )
  }
}

export default MenuLeft