import axios from 'axios'
import { API } from '../../config/default.json'
import { isProduction } from '../env'

const baseURL = isProduction ? process.env.BASE_URL : API.baseUrl
const Axios = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
})

/*
 * 设置请求拦截器
 * TOKEN校验（JWT）：接收服务器返回的token
 */
Axios.interceptors.request.use(
  config => {
    try {
      // config.headers.Authorization = getToken();
    } catch (err) {
      return Promise.reject(error)
    } finally {
      return config
    }
  },
  error => {
    return Promise.reject(error)
  }
)

/*
 * 响应拦截器
 */

Axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default Axios
