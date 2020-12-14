import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'

import store from '../redux/store.js'
import {deleteUserInfoAction} from '../redux/actions/userInfo.js'
const instance =  axios.create({
})

instance.interceptors.request.use(function (config) {
  //如果用户已经登录，从store中取出token并放到每个请求的请求头上
  const {token} = store.getState().userInfo
  if(token){
    config.headers.Authorization = "mqqmqqmq" + token
  }
  //如果服务端之接受urlencode格式参数的话，将每个psot请求携带的数据转为urlencode格式
  const {method} = config
  if(method.toLocaleLowerCase === "post"){
    config.data = qs.stringify(config.data)
  }
  
  return config
}, function (error) {
  message.error(error.message)
  return new Promise(()=>{})
})

instance.interceptors.response.use(function(response){
  return response.data
}, function (error) {
  if(error.response.status === 401){
    //此时说明token为无效的，需要删除相关信息打回重新登录
    message.error('登录信息已失效，请重新登录！')
    store.dispatch(deleteUserInfoAction())
  }else
    message.error(error.message)
  return new Promise(()=>{})
})
export default instance