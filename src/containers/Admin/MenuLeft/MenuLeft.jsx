import {Component} from 'react'
import {Menu,Icon} from 'antd'
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import './css/MenuLeft.less'
import logo from '../../../static/images/logo.jpg'
import categoryList from '../../../config/menu-config.js'
import {createUpdateTitleAction} from '../../../redux/actions/menu'
const {SubMenu} = Menu 

@connect(state=>({user:state.userInfo.user}),{
  updateTitle:createUpdateTitleAction
})
@withRouter
class MenuLeft extends Component{
  updateTitleFun = (value)=>{
    this.props.updateTitle(value)
  }
  hasAuth = (item)=>{
    //获取当前用户可以看到的菜单的数组
    const {menus} = this.props.user.role
    const {username} = this.props.user
    if(username === 'admin') return true
    else if(!item.children){
      return menus.find((item2)=>{return item2 === '/'+item.key})
    }else if (item.children){
      return item.children.some((item3)=>{return menus.indexOf('/'+item3.key) !== -1})
    }
  }
  // //通过递归动态添加菜单列表
  // addCategory = (List)=>{
  //   return List.map((item)=>{
  //     if(this.hasAuth(item)){
  //       if(item.children instanceof Array){
  //         return (
  //           <SubMenu
  //             key={item.key}
  //             title={
  //               <span>
  //                 <Icon type={item.icon} />
  //                 <span>{item.title}</span>
  //               </span>
  //             }
  //           >
  //             {this.addCategory(item.children)}
  //           </SubMenu>
  //         )
  //       }else{
  //         return (
  //           <Menu.Item key={item.key} onClick={()=>{this.updateTitleFun(item.title)}}>
  //             <Link to={item.path}>
  //               <Icon type={item.icon}/>
  //               <span>{item.title}</span>
  //             </Link>
  //           </Menu.Item>
  //         )
  //       }
  //     }
  //   })
  // }


  //用于创建菜单的函数
  addCategory = (target)=>{
    return target.map((item)=>{
      if(this.hasAuth(item)){
        if(!item.children){
          return (
            <Menu.Item key={item.key} onClick={()=>{this.updateTitleFun(item.title)}}>
              <Link to={item.path}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }else{
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.addCategory(item.children)}
            </SubMenu>
          )
        }
      }else return ''
    })
  }
  render(){
    const routePath = this.props.history.location.pathname.split('/').splice(2).reverse()
    const selectKey = routePath.indexOf('product') !== -1 ?'product':routePath[0]
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