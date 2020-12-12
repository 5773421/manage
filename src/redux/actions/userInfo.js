import {SAVEUSERINFO,DELETEUSERINFO} from '../action_types.js'

export const saveUserInfoAction = (values)=> {
  localStorage.setItem('user',JSON.stringify(values.user))
  localStorage.setItem('token',values.token)
  return {type:SAVEUSERINFO,data:values}
}
export const deleteUserInfoAction = ()=>{
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  return {type:DELETEUSERINFO}
}