import { mockActivities } from '../mocks/activities'
import type { Activity } from '../types/domain'

export type DiscoverTab = 'recommended' | 'latest' | 'nearby'

export function getMockActivities(tab: DiscoverTab): Activity[] {
  if (tab === 'latest') return [...mockActivities].reverse()
  if (tab === 'nearby') return [...mockActivities].sort((a, b) => (a.distance_text || '').localeCompare(b.distance_text || ''))
  return mockActivities
}

export function findMockActivity(id?: string) {
  return mockActivities.find((item) => item.id === id) || mockActivities[0]
}
