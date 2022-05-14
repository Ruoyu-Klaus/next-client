import axios from 'axios'
import {API} from '../../config/default.json'
import {isProduction} from '../env'

const baseURL = isProduction ? process.env.BASE_URL : API.baseUrl
const Axios = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    withCredentials: true,
})

Axios.interceptors.request.use(
    (config) => {
        try {
            // config.headers.Authorization = getToken();
        } catch (err) {
            return Promise.reject(error)
        } finally {
            return config
        }
    },
    (error) => {
        return Promise.reject(error)
    },
)

Axios.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default Axios
