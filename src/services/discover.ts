import { request } from './http'
import type { Activity } from '../types/domain'

export type DiscoverTab = 'recommended' | 'latest' | 'nearby'

export function getActivities(tab: DiscoverTab, params?: { cursor?: string; limit?: number }) {
  const endpoint = tab === 'latest' ? '/discover/latest'
    : tab === 'nearby' ? '/discover/nearby'
    : '/discover/recommended'
  return request<Activity[]>({
    url: endpoint,
    method: 'GET',
    data: { cursor: params?.cursor, limit: params?.limit || 20 },
  })
}

export function getActivityDetail(id: string) {
  return request<Activity>({
    url: `/activities/${id}`,
    method: 'GET',
  })
}

export function searchActivities(q: string, params?: { cursor?: string; limit?: number }) {
  return request<Activity[]>({
    url: '/discover/search',
    method: 'GET',
    data: { q, cursor: params?.cursor, limit: params?.limit || 20 },
  })
}

export function getNearbyActivities(params?: {
  lat?: number
  lng?: number
  radius?: number
  cursor?: string
  limit?: number
}) {
  return request<Activity[]>({
    url: '/discover/nearby',
    method: 'GET',
    data: {
      lat: params?.lat,
      lng: params?.lng,
      radius: params?.radius,
      cursor: params?.cursor,
      limit: params?.limit || 20,
    },
  })
}

export function getMapActivities(params: {
  sw_lat: number
  sw_lng: number
  ne_lat: number
  ne_lng: number
}) {
  return request<Activity[]>({
    url: '/discover/map',
    method: 'GET',
    data: params,
  })
}

export function submitRegistration(activityId: string, data?: { phone?: string; remark?: string }) {
  return request<void>({
    url: `/activities/${activityId}/register`,
    method: 'POST',
    data,
  })
}

export function cancelRegistration(activityId: string) {
  return request<void>({
    url: `/activities/${activityId}/cancel-registration`,
    method: 'POST',
  })
}

export function getMyCreatedActivities(params?: { cursor?: string; limit?: number }) {
  return request<Activity[]>({
    url: '/users/me/created-activities',
    method: 'GET',
    data: { cursor: params?.cursor, limit: params?.limit || 20 },
  })
}

export function getMyJoinedActivities(params?: { cursor?: string; limit?: number }) {
  return request<Activity[]>({
    url: '/users/me/joined-activities',
    method: 'GET',
    data: { cursor: params?.cursor, limit: params?.limit || 20 },
  })
}
