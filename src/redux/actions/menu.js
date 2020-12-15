import {UPDATETITLE} from '../action_types.js'

export const createUpdateTitleAction = (values)=> {
  return {type:UPDATETITLE,data:values}
}