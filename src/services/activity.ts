import { request, type RequestResult } from './http'
import type { Activity } from '../types/domain'

/** POST /api/activities — 创建活动 */
export function createActivity(data: Record<string, any>): Promise<RequestResult<Activity>> {
  return request<Activity>({
    url: '/activities',
    method: 'POST',
    data,
  })
}

/** PUT /api/activities/:id — 更新活动 */
export function updateActivity(id: string, data: Record<string, any>): Promise<RequestResult<Activity>> {
  return request<Activity>({
    url: `/activities/${id}`,
    method: 'PUT',
    data,
  })
}

/** DELETE /api/activities/:id — 删除草稿 */
export function deleteActivity(id: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/activities/${id}`,
    method: 'DELETE',
  })
}

/** POST /api/activities/:id/submit — 提交审核 */
export function submitActivity(id: string): Promise<RequestResult<Activity>> {
  return request<Activity>({
    url: `/activities/${id}/submit`,
    method: 'POST',
  })
}

/** POST /api/activities/:id/clone — 克隆活动 */
export function cloneActivity(id: string): Promise<RequestResult<Activity>> {
  return request<Activity>({
    url: `/activities/${id}/clone`,
    method: 'POST',
  })
}

/** POST /api/activities/:id/register — 报名 */
export function registerActivity(activityId: string, formData?: Record<string, any>): Promise<RequestResult<{ registration_id?: string }>> {
  return request<{ registration_id?: string }>({
    url: `/activities/${activityId}/register`,
    method: 'POST',
    data: formData ? { form_data: formData } : {},
  })
}

/** POST /api/activities/:id/cancel-registration — 取消报名 */
export function cancelRegistration(activityId: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/activities/${activityId}/cancel-registration`,
    method: 'POST',
  })
}

/** POST /api/activities/:id/join-waitlist — 加入候补 */
export function joinWaitlist(activityId: string): Promise<RequestResult<{ position: number; waiting_count_ahead: number }>> {
  return request<{ position: number; waiting_count_ahead: number }>({
    url: `/activities/${activityId}/join-waitlist`,
    method: 'POST',
  })
}

/** DELETE /api/activities/:id/leave-waitlist — 离开候补 */
export function leaveWaitlist(activityId: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/activities/${activityId}/leave-waitlist`,
    method: 'DELETE',
  })
}

/** GET /api/activities/:id/participants — 参与者列表 */
export function getParticipants(activityId: string): Promise<RequestResult<any[]>> {
  return request<any[]>({
    url: `/activities/${activityId}/participants`,
    method: 'GET',
  })
}

/** POST /api/activities/:id/check-in — 签到 */
export function checkIn(activityId: string, qrData: string, lat?: number, lng?: number): Promise<RequestResult<void>> {
  return request<void>({
    url: `/activities/${activityId}/check-in`,
    method: 'POST',
    data: { qr_data: qrData, lat, lng },
  })
}

/** GET /api/activities/:id/check-in/list — 签到列表 */
export function getCheckInList(activityId: string): Promise<RequestResult<any[]>> {
  return request<any[]>({
    url: `/activities/${activityId}/check-in/list`,
    method: 'GET',
  })
}

/** POST /api/activities/:id/check-in/qrcode — 获取签到二维码 */
export function getCheckInQrcode(activityId: string): Promise<RequestResult<{ qr_data?: string }>> {
  return request<{ qr_data?: string }>({
    url: `/activities/${activityId}/check-in/qrcode`,
    method: 'POST',
  })
}

/** POST /api/activities/:id/reviews — 创建评价 */
export function createReview(activityId: string, content: string): Promise<RequestResult<any>> {
  return request<any>({
    url: `/activities/${activityId}/reviews`,
    method: 'POST',
    data: { content },
  })
}

/** GET /api/activities/:id/reviews — 评价列表 */
export function getReviews(activityId: string): Promise<RequestResult<any[]>> {
  return request<any[]>({
    url: `/activities/${activityId}/reviews`,
    method: 'GET',
  })
}

/** POST /api/activities/:id/summary — 创建/更新活动总结 */
export function saveSummary(activityId: string, content: string): Promise<RequestResult<any>> {
  return request<any>({
    url: `/activities/${activityId}/summary`,
    method: 'POST',
    data: { content },
  })
}

/** GET /api/activities/:id/summary — 获取活动总结 */
export function getSummary(activityId: string): Promise<RequestResult<any>> {
  return request<any>({
    url: `/activities/${activityId}/summary`,
    method: 'GET',
  })
}

/** GET /api/templates — 模板列表 */
export function getTemplates(category?: string): Promise<RequestResult<{ categories?: string[]; templates?: any[] }>> {
  return request<{ categories?: string[]; templates?: any[] }>({
    url: '/templates',
    method: 'GET',
    data: category ? { category } : {},
  })
}

/** POST /api/templates/:id/use — 使用模板创建活动 */
export function useTemplate(id: string): Promise<RequestResult<Activity>> {
  return request<Activity>({
    url: `/templates/${id}/use`,
    method: 'POST',
  })
}
