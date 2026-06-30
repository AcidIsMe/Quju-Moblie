import { ApiError, type RequestResult } from './http'

/** POST /api/files/upload — 上传文件 */
export function uploadFile(filePath: string, type = 'misc'): Promise<RequestResult<{ url: string; key: string }>> {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('access_token')
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api'

    uni.uploadFile({
      url: `${BASE_URL}/files/upload`,
      filePath,
      name: 'file',
      formData: { type },
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success(response) {
        try {
          const body = JSON.parse(response.data)
          if (response.statusCode >= 200 && response.statusCode < 300 && body.code === 0) {
            resolve({ data: body.data, pagination: body.pagination })
          } else {
            reject(new ApiError(body.code || 50000, body.message || '上传失败'))
          }
        } catch {
          reject(new Error('解析上传响应失败'))
        }
      },
      fail(error) {
        reject(new Error(error.errMsg || '上传失败'))
      },
    })
  })
}
