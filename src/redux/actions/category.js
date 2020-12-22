import {SAVECATELIST} from '../action_types.js'

export const createSaveCateListAction = (values)=> {
  return {type:SAVECATELIST,data:values}
}