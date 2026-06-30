import { request, type RequestResult } from './http'
import type { UserProfile } from '../types/domain'

/** GET /api/users/me — 当前用户信息 */
export function getMyProfile(): Promise<RequestResult<UserProfile>> {
  return request<UserProfile>({
    url: '/users/me',
    method: 'GET',
  })
}

/** PATCH /api/users/me — 更新当前用户信息 */
export function updateMyProfile(data: Record<string, any>): Promise<RequestResult<UserProfile>> {
  return request<UserProfile>({
    url: '/users/me',
    method: 'PATCH',
    data,
  })
}

/** GET /api/users/:id — 用户公开信息 */
export function getUserPublicInfo(id: string): Promise<RequestResult<Record<string, any>>> {
  return request<Record<string, any>>({
    url: `/users/${id}`,
    method: 'GET',
  })
}

/** GET /api/users/check-nickname — 检查昵称 */
export function checkNickname(nickname: string): Promise<RequestResult<{ available: boolean }>> {
  return request<{ available: boolean }>({
    url: '/users/check-nickname',
    method: 'GET',
    data: { nickname },
  })
}

/** GET /api/users/me/created-activities — 我创建的活动 */
export function getMyCreatedActivities(cursor?: string, limit = 20): Promise<RequestResult<any[]>> {
  return request<any[]>({
    url: '/users/me/created-activities',
    method: 'GET',
    data: { cursor, limit },
  })
}

/** GET /api/users/me/joined-activities — 我报名的活动 */
export function getMyJoinedActivities(cursor?: string, limit = 20): Promise<RequestResult<any[]>> {
  return request<any[]>({
    url: '/users/me/joined-activities',
    method: 'GET',
    data: { cursor, limit },
  })
}

// ===== 好友 =====

/** POST /api/friends/requests — 发送好友请求 */
export function sendFriendRequest(targetUserId: string): Promise<RequestResult<Record<string, any>>> {
  return request<Record<string, any>>({
    url: '/friends/requests',
    method: 'POST',
    data: { target_user_id: targetUserId },
  })
}

/** GET /api/friends — 好友列表 */
export function getFriends(): Promise<RequestResult<any[]>> {
  return request<any[]>({
    url: '/friends',
    method: 'GET',
  })
}

/** POST /api/friends/requests/:id/accept — 接受好友请求 */
export function acceptFriendRequest(id: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/friends/requests/${id}/accept`,
    method: 'POST',
  })
}

/** POST /api/friends/requests/:id/reject — 拒绝好友请求 */
export function rejectFriendRequest(id: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/friends/requests/${id}/reject`,
    method: 'POST',
  })
}

/** DELETE /api/friends/:targetUserId — 删除好友 */
export function deleteFriend(targetUserId: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/friends/${targetUserId}`,
    method: 'DELETE',
  })
}

// ===== 关注 =====

/** POST /api/follows/:targetUserId — 关注 */
export function followUser(targetUserId: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/follows/${targetUserId}`,
    method: 'POST',
  })
}

/** DELETE /api/follows/:targetUserId — 取消关注 */
export function unfollowUser(targetUserId: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/follows/${targetUserId}`,
    method: 'DELETE',
  })
}
