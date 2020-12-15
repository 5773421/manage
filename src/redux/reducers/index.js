import {combineReducers} from 'redux'
import userInfo from './userInfo.js'
import menuInfo from './menu.js'
export default combineReducers({
  userInfo:userInfo,
  menuInfo:menuInfo
})
