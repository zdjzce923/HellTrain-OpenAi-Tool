import { openApiRequest } from '@/api/http'
import type { AxiosResponse } from 'axios'
import config from '@/config'
import { message } from 'ant-design-vue'

// 过滤返回数据
function handleResponseSuccess(res: AxiosResponse) {
  const data = res.data
  if (data.status == 0) {
    return data.result || data
  } else {
    message.error(data.message)
    // 抛出错误
    const error = new Error(data.message || '系统内部错误')
    // @ts-ignore
    error.code = data.status
    throw error
  }
}
// 处理错误
function handleResponseError(error: any) {
  // 后端返回401直接到登录
  if (error?.response?.status === 401) {
    location.href = config.BASE_ROUTE + 'login'
  }
  if (error?.response) {
    throw new Error(error.response.data)
  }
  return Promise.reject(error)
}

openApiRequest.interceptors.response.use(handleResponseSuccess)
openApiRequest.interceptors.response.use(undefined, handleResponseError)
