import axios from 'axios'
import qs from 'querystring'

export const reqLogin = (username,password)=> 
axios.post('http://localhost:3000/login',qs.stringify({username,password}))
