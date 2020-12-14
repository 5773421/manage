import myAxios from './Ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
import {BASEURL,IPAPI,APIKEY, WEATHERAPI} from '../config'


export const reqLogin = (username,password)=> myAxios.post(`${BASEURL}/login`,{username,password})
export const reqIp = ()=>{
  return new Promise((resolve,reject)=>{
    jsonp(`${IPAPI}?key=${APIKEY}`,{timeout:4000},(err,data)=>{
      if(err){
        message.error('ip解析相关接口失效，请联系管理员！！',2)
        return new Promise(()=>{})
      }else{
        if(data.status === "0"){
          message.error('天气相关接口失效，请联系管理员！！',2)
          return new Promise(()=>{})
        }else{
          resolve(data.adcode)
        }
        
      }
    })
  })
}
export const reqWeather = (adcode)=>{
  return new Promise((resolve,reject)=>{
    jsonp(`${WEATHERAPI}?key=${APIKEY}&city=${adcode}`,{timeout:4000},(err,data)=>{
      if(err){
        message.error('天气相关接口失效，请联系管理员！！',1)
        return new Promise(()=>{})
      }else{
        if(data.status === "0"){
          message.error('天气相关接口失效，请联系管理员！！',1)
          return new Promise(()=>{})
        }else{
          const {weather,city,temperature} = data.lives[0]
          resolve({weather,city,temperature})
        }
      }
    })
  })
}
export const reqCategory = ()=> myAxios.get(`${BASEURL}/manage/category/list`)