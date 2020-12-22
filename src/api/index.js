import myAxios from './Ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
import {BASEURL,IPAPI,APIKEY, WEATHERAPI} from '../config'

//请求登录
export const reqLogin = (username,password)=> myAxios.post(`${BASEURL}/login`,{username,password})
//通过当前api获取城市编码
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
//通过城市编码获取该地天气信息
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
//请求商品分类列表
export const reqCategory = ()=> myAxios.get(`${BASEURL}/manage/category/list`)
//请求修改商品分类
export const reqUpdateCategory = (categoryId,categoryName)=>myAxios.post(`${BASEURL}/manage/category/update`,{categoryId,categoryName})
//请求增加商品分类
export const reqAddCategory = (categoryName)=> myAxios.post(`${BASEURL}/manage/category/add`,{categoryName})
//请求商品列表
export const reqProductList = (pageNum,pageSize)=> myAxios.get(`${BASEURL}/manage/product/list`,{params:{pageNum,pageSize}})
//请求更新商品上下架状态
export const reqUpdateProdStatus = (productId,status)=> myAxios.post(`${BASEURL}/manage/product/updateStatus`,{productId,status})
//请求搜索商品
export const reqSearchProd = (pageNum,pageSize,searchType,keyword)=>myAxios.get(`${BASEURL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyword}})
//请求商品通过Id
export const reqProdById = (productId)=>myAxios.get(`${BASEURL}/manage/product/info`,{params:{productId}})
//请求删除图片
export const reqDeleteImg = (name)=> myAxios.post(`${BASEURL}/manage/img/delete`,{name})
//请求新增商品
export const reqAddProduct = (prodObj)=> myAxios.post(`${BASEURL}/manage/product/add`,prodObj)
//请求修改商品
export const reqUpdateProduct = (Obj) => myAxios.post(`${BASEURL}/manage/product/update`,Obj)
//新增角色
export const reqAddRole = ({roleName}) => myAxios.post(`${BASEURL}/manage/role/add`,{roleName})
//请求角色列表
export const reqRoleList = ()=>myAxios.get(`${BASEURL}/manage/role/list`)
//请求给角色设置权限
export const reqUpdateRoleAuth = ({_id,menus,auth_name}) => myAxios.post(`${BASEURL}/manage/role/update`,{_id,menus,auth_name,auth_time:Date.now()})
//请求所有用户列表
export const reqUserList = ()=> myAxios.get(`${BASEURL}/manage/user/list`)
//请求添加新用户
export const reqAddUser = (user) => myAxios.post(`${BASEURL}/manage/user/add`,{...user})
//请求修改用户
export const reqUpdateUser = (user) => myAxios.post(`${BASEURL}/manage/user/update`,{...user})