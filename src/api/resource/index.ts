import request from '@/axios'

export const getFileListApi = (data) => {
    return request.post({ url: '/api/file/getPage', data })
  }

export const getProductListApi = (data) => {
    return request.post({ url: '/api/productList/getPage', data })
  }