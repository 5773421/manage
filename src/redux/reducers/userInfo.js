import {SAVEUSERINFO,DELETEUSERINFO} from '../action_types.js'

let user = JSON.parse(localStorage.getItem('user'))
let token = localStorage.getItem('token')

const initState = {
  user:user || {},
  token:token || '',
  isLogin: user && token ? true : false
}

export default function test(preState=initState,action){
  const {type,data} = action
  let newState
  switch (type) {
    case SAVEUSERINFO:
      const {user,token} = data
      newState = {user,token,isLogin:true}
      return newState
    case DELETEUSERINFO:
      newState = {user:{},token:'',isLogin:false}
      return newState
    default:
      return preState
  }
}