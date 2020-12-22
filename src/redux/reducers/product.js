import {UPDATEPRODLIST} from '../action_types.js'
const initState = {prodList:[]}

export default function test(preState=initState,action){
  const {type,data} = action
  let newState
  switch (type) {
    case UPDATEPRODLIST:
      newState = {prodList:data}
      return newState
    default:
      return preState
  }
}