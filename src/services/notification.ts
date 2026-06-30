import { request, type RequestResult } from './http'
import type { NotificationItem } from '../types/domain'

/** GET /api/notifications — 通知列表 */
export function getNotifications(): Promise<RequestResult<NotificationItem[]>> {
  return request<NotificationItem[]>({
    url: '/notifications',
    method: 'GET',
  })
}

/** GET /api/notifications/unread-count — 未读数量 */
export function getUnreadCount(): Promise<RequestResult<{ count: number }>> {
  return request<{ count: number }>({
    url: '/notifications/unread-count',
    method: 'GET',
  })
}

/** PATCH /api/notifications/:id/read — 标记已读 */
export function markRead(id: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/notifications/${id}/read`,
    method: 'PATCH',
  })
}
