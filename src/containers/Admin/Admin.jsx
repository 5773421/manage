import {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {deleteUserInfoAction} from '../../redux/actions/userInfo'

class Admin extends Component{
  logout = ()=>{
    this.props.deleteUserInfo()
  }
  render(){
    const {isLogin} = this.props
    if(isLogin){
      return (
        <div>Admin
          <button onClick={this.logout}>退出登录</button>
        </div>
      )
    }else{
      return <Redirect to="/login"/>
    }   
  }
}


export default connect((state)=>state.userInfo,{
  deleteUserInfo:deleteUserInfoAction
})(Admin)