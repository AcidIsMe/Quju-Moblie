import { request, type RequestResult } from './http'
import type { Team } from '../types/domain'

/** POST /api/teams — 创建团队 */
export function createTeam(data: {
  name: string
  description?: string
  interest_tags?: string[]
  join_type?: 'public' | 'review'
  max_members?: number
  avatar_url?: string
}): Promise<RequestResult<Team>> {
  return request<Team>({
    url: '/teams',
    method: 'POST',
    data,
  })
}

/** GET /api/teams — 团队列表 */
export function getTeams(q?: string, limit?: number): Promise<RequestResult<Team[]>> {
  return request<Team[]>({
    url: '/teams',
    method: 'GET',
    data: { q, limit },
  })
}

/** GET /api/teams/:id — 团队详情 */
export function getTeamDetail(id: string): Promise<RequestResult<Team>> {
  return request<Team>({
    url: `/teams/${id}`,
    method: 'GET',
  })
}

/** POST /api/teams/:id/join — 加入团队 */
export function joinTeam(id: string): Promise<RequestResult<Record<string, any>>> {
  return request<Record<string, any>>({
    url: `/teams/${id}/join`,
    method: 'POST',
  })
}

/** POST /api/teams/:id/dissolve — 解散团队 */
export function dissolveTeam(id: string): Promise<RequestResult<void>> {
  return request<void>({
    url: `/teams/${id}/dissolve`,
    method: 'POST',
  })
}
