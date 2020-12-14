import {Component} from 'react'
import {Button,Icon,Modal} from 'antd'
import dayjs from 'dayjs'
import {withRouter} from 'react-router-dom'
import screenfull from 'screenfull'
import {deleteUserInfoAction} from '../../../redux/actions/userInfo.js'
import {reqIp,reqWeather} from '../../../api'
import './css/Header.less'
import { connect } from 'react-redux'


@connect((state)=>state.userInfo,{
  deleteUser:deleteUserInfoAction
})
@withRouter
class Header extends Component{
  state = {
    time:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weatherObj:{
      city:'上海市',
      weather:'晴',
      temperature:18,
    },
    Screen:false
  }
  componentDidMount(){
    this.intervalId = setInterval(() => {
      this.setState({time:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
    }, 1000);
    this.reqMyWeather()
    screenfull.on('change', () => {
      let Screen = !this.state.Screen
      this.setState({Screen})
    });
  }
  componentWillUnmount(){
    clearInterval(this.intervalId)
  }
  //实现通过ip对应出adcode(城市编码) 然后获取该城市天气信息
  reqMyWeather = ()=>{
    reqIp().then((adcode)=>{
      return adcode
    }).then((adcode)=>{
      return reqWeather(adcode)
    }).then((weatherObj)=>{
      this.setState({weatherObj})
    })
  }
  //退出登录
  layOut = ()=>{
    Modal.confirm({
      title:'确定退出登录吗？',
      content:'退出登录后将返回登录界面',
      okText:'确定',
      cancelText:'取消',
      onOk:()=>{
        this.props.deleteUser()
      }
    })
  }
  //全屏切换
  screenFull = ()=>{
    screenfull.toggle()
  }
  render(){
    const {weather,temperature,city} = this.state.weatherObj
    const {Screen} = this.state
    return(
      <header className="header">
        <div className="header-top">
          <Button  size="small" onClick={this.screenFull}><Icon type={Screen?'fullscreen-exit':'fullscreen'} /></Button>
          &nbsp;&nbsp;欢迎 admin
          <Button type="link" onClick={this.layOut}>退出</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>{this.props.history.location.pathname}</span>
          </div>
          <div className="header-bottom-right">
            {this.state.time}&nbsp;&nbsp;
            {`${city} ${weather} ${temperature}°C`}
          </div>        
        </div>
      </header>
    )
  }
}
export default Header