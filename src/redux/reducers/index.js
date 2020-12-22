import {combineReducers} from 'redux'
import userInfo from './userInfo.js'
import menuInfo from './menu.js'
import prodInfo from './product.js'
import cateInfo from './category.js'
export default combineReducers({
  userInfo:userInfo,
  menuInfo:menuInfo,
  prodInfo:prodInfo,
  cateInfo:cateInfo
})
