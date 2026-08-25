import axios from 'axios'
import qs from 'qs'
import {
  authInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from './interceptors'

const baseUrl = import.meta.env.VUE_APP_API_URL

const httpClient = axios.create({
  baseURL: baseUrl,
  'Content-type': 'application/json',
})

httpClient.interceptors.request.use(authInterceptor)
httpClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
)

httpClient.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true })
}

export const http = httpClient
