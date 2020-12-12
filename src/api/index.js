import myAxios from '../Ajax'
import {BASEURL} from '../config'

export const reqLogin = (username,password)=> 
myAxios.post(`${BASEURL}/login`,{username,password})
