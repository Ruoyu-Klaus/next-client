/*
 * @Author: Ruoyu
 * @FilePath: \next-client\helpers\axios\index.js
 */
import axios from 'axios';
import { API } from '../../config/default.json';
const baseURL =
  process.env.NODE_ENV === 'production' ? process.env.BASE_URL : API.baseUrl;
const Axios = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
});

/*
 * 设置请求传递数据的格式
 * x-www-form-urlencoded
 */
// Axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// Axios.defaults.transformRequest = data => qs.stringify(data);

/*
 * 设置请求拦截器
 * TOKEN校验（JWT）：接收服务器返回的token
 */
Axios.interceptors.request.use(
  config => {
    try {
      // config.headers.Authorization = getToken();
    } catch (err) {
      console.error(err);
    } finally {
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

/*
 * 响应拦截器
 */

Axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error(error);
  }
);

export default Axios;
