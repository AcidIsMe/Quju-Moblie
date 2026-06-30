import { request, type RequestResult } from './http'
import type { Activity } from '../types/domain'

export type DiscoverTab = 'recommended' | 'latest' | 'nearby'

interface DiscoverParams {
  cursor?: string
  limit?: number
  lat?: number
  lng?: number
  radius?: number
  q?: string
  city?: string
  type?: string
  activityTypes?: string
  feeType?: string
  startAfter?: string
  startBefore?: string
}

export async function getDiscoverActivities(
  tab: DiscoverTab,
  params: DiscoverParams = {},
): Promise<RequestResult<Activity[]>> {
  const { cursor, limit = 20, lat, lng } = params
  const query: Record<string, any> = { cursor, limit }

  if (tab === 'nearby' && lat != null && lng != null) {
    query.lat = lat
    query.lng = lng
    query.radius = params.radius || 10000
  }
  if (params.q) query.q = params.q
  if (params.city) query.city = params.city
  if (params.type) query.type = params.type
  if (params.feeType) query.feeType = params.feeType
  if (params.startAfter) query.startAfter = params.startAfter
  if (params.startBefore) query.startBefore = params.startBefore

  const urlMap: Record<DiscoverTab, string> = {
    recommended: '/discover/recommended',
    latest: '/discover/latest',
    nearby: '/discover/nearby',
  }

  return request<Activity[]>({
    url: urlMap[tab],
    method: 'GET',
    data: query,
  })
}

/** GET /api/discover/search — 搜索/筛选活动 */
export async function searchActivities(params: DiscoverParams): Promise<RequestResult<Activity[]>> {
  const query: Record<string, any> = {}
  if (params.cursor) query.cursor = params.cursor
  if (params.limit) query.limit = params.limit
  if (params.q) query.q = params.q
  if (params.city) query.city = params.city
  if (params.type) query.type = params.type
  if (params.feeType) query.feeType = params.feeType
  if (params.startAfter) query.startAfter = params.startAfter
  if (params.startBefore) query.startBefore = params.startBefore

  return request<Activity[]>({
    url: '/discover/filter',
    method: 'GET',
    data: query,
  })
}

/** GET /api/discover/map — 地图范围查询 */
export async function getMapActivities(
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number,
): Promise<RequestResult<Activity[]>> {
  return request<Activity[]>({
    url: '/discover/map',
    method: 'GET',
    data: { swLat, swLng, neLat, neLng },
  })
}

/** GET /api/activities/:id — 获取活动详情 */
export async function getActivityDetail(id: string): Promise<RequestResult<Activity>> {
  return request<Activity>({
    url: `/activities/${id}`,
    method: 'GET',
  })
}
