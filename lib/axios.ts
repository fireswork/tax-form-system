import axios from 'axios'
import { toast } from 'sonner' // 使用sonner来显示错误提示

// const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://172.17.118.161:3000'

const axiosInstance = axios.create({
  // baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 这里可以添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again later.'
    toast.error(errorMessage)
    
    // 返回一个空数据而不是reject，这样不会导致页面崩溃
    if (error.config.url.includes('/basicData')) {
      return { states: [] }
    }
    if (error.config.url.includes('/formFields')) {
      return {
        title: '',
        description: '',
        type: 'object',
        required: [],
        properties: {}
      }
    }
    return {}
  }
)

export default axiosInstance 