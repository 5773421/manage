import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'

const instance =  axios.create({
})

instance.interceptors.request.use(function (config) {
  config.data = qs.stringify(config.data)
  return config
}, function (error) {
  message.error(error.message)
  return new Promise(()=>{})
})

instance.interceptors.response.use(function(response){
  return response.data
}, function (error) {
  message.error(error.message)
  return new Promise(()=>{})
})
export default instance