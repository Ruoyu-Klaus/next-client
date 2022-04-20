import {API} from '../config/default.json'

export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const BASE_API_URL = isProduction ? process.env.BASE_URL : API.baseUrl
