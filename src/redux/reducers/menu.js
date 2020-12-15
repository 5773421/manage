import {UPDATETITLE} from '../action_types.js'
const initState = {title:''}

export default function test(preState=initState,action){
  const {type,data} = action
  let newState
  switch (type) {
    case UPDATETITLE:
      newState = {title:data}
      return newState
    default:
      return preState
  }
}