import {SAVECATELIST} from '../action_types.js'
const initState = {categoryList:[]}

export default function test(preState=initState,action){
  const {type,data} = action
  let newState
  switch (type) {
    case SAVECATELIST:
      newState = {categoryList:data}
      return newState
    default:
      return preState
  }
}