import {TEST1,TEST2} from '../action_types.js'

const initState = 0

export default function test(preState=initState,action){
  const {type,data} = action
  let newState
  switch (type) {
    case TEST1:
      newState = data + 2
      return newState
    case TEST2:
      newState = data - 1
      return newState
    default:
      return preState
  }
}