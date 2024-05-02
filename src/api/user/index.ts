import request from '@/axios'
import type { UserType } from './types'

export const registerApi = (data) => {
  return request.post({ url: '/api/user/register', data })
}