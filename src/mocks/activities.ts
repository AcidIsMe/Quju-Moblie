import type { Activity, ActivityTemplate, Friend, FriendRequest, NotificationItem, Review, Team, UserProfile } from '../types/domain'

export const mockUser: UserProfile = {
  id: 'u_001',
  email: 'demo@quju.local',
  nickname: '周末探索者',
  avatar_url: '',
  bio: '喜欢徒步、桌游和城市探索。',
  role: 'personal',
  status: 'active',
  credit_score: 100,
  interest_tags: ['户外', '徒步', '桌游'],
}

export const mockActivities: Activity[] = [
  {
    id: 'a_001',
    title: '周末奥森轻徒步',
    description: '沿奥森南园轻松徒步，适合新手参加，活动结束后可自由拼饭交流。',
    tags: ['户外', '徒步', '周末'],
    activity_type: '户外徒步',
    start_time: '2026-07-04 09:00',
    end_time: '2026-07-04 12:00',
    registration_deadline: '2026-07-03 20:00',
    max_participants: 24,
    current_participants: 16,
    min_credit_score: 80,
    min_age: 18,
    fee_type: 'free',
    fee_amount: 0,
    city: '北京',
    location_name: '奥林匹克森林公园南门',
    location_lat: 40.015,
    location_lng: 116.392,
    distance_text: '3.2km',
    status: 'published',
    creator: { id: 'u_002', nickname: '山野同频', avatar_url: '' },
  },
  {
    id: 'a_002',
    title: '咖啡馆剧本杀新手局',
    description: '轻推理、低压力，适合第一次体验剧本杀的朋友。',
    tags: ['桌游', '推理', '交友'],
    activity_type: '桌游聚会',
    start_time: '2026-07-05 14:00',
    end_time: '2026-07-05 18:00',
    registration_deadline: '2026-07-04 22:00',
    max_participants: 8,
    current_participants: 6,
    min_credit_score: 70,
    min_age: 18,
    fee_type: 'paid',
    fee_amount: 68,
    city: '上海',
    location_name: '静安区某咖啡馆',
    location_lat: 31.229,
    location_lng: 121.459,
    distance_text: '5.8km',
    status: 'published',
    creator: { id: 'u_003', nickname: '小桌游局', avatar_url: '' },
  },
  {
    id: 'a_003',
    title: '城市摄影散步',
    description: '从老街到江边，边走边拍，互相交流构图和后期思路。',
    tags: ['摄影', '城市探索'],
    activity_type: '城市探索',
    start_time: '2026-07-06 16:00',
    end_time: '2026-07-06 19:00',
    registration_deadline: '2026-07-05 21:00',
    max_participants: 12,
    current_participants: 12,
    min_credit_score: 80,
    min_age: 16,
    fee_type: 'free',
    fee_amount: 0,
    city: '广州',
    location_name: '沙面公园',
    location_lat: 23.11,
    location_lng: 113.24,
    distance_text: '8.1km',
    status: 'published',
    creator: { id: 'u_004', nickname: '镜头漫游', avatar_url: '' },
  },
]

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n_001',
    type: 'activity_published',
    title: '活动审核通过',
    content: '你发布的「周末奥森轻徒步」已上线。',
    is_read: false,
    created_at: '2026-06-29 17:30',
  },
  {
    id: 'n_002',
    type: 'system',
    title: '欢迎来到趣聚',
    content: '完善兴趣标签后，首页推荐会更准确。',
    is_read: true,
    created_at: '2026-06-29 16:10',
  },
]

export const mockTemplates: ActivityTemplate[] = [
  {
    id: 'tpl_001',
    name: '周末轻徒步',
    category: '户外徒步',
    description: '适合新手的半日徒步模板，包含集合、路线、补给和安全提示。',
    tags: ['户外', '徒步', '周末'],
    activity_type: '户外徒步',
    preset_duration_minutes: 180,
    preset_max_participants: 24,
  },
  {
    id: 'tpl_002',
    name: '桌游破冰局',
    category: '桌游聚会',
    description: '低门槛桌游局，适合陌生人快速熟悉。',
    tags: ['桌游', '破冰', '交友'],
    activity_type: '桌游聚会',
    preset_duration_minutes: 240,
    preset_max_participants: 8,
  },
  {
    id: 'tpl_003',
    name: '城市摄影散步',
    category: '城市探索',
    description: '从城市街区出发，围绕一个主题进行拍摄和交流。',
    tags: ['摄影', '城市探索'],
    activity_type: '城市探索',
    preset_duration_minutes: 150,
    preset_max_participants: 12,
  },
]

export const mockDrafts: Activity[] = [
  {
    ...mockActivities[0],
    id: 'draft_001',
    title: '周日公园飞盘体验',
    activity_type: '运动健身',
    tags: ['飞盘', '运动', '新手'],
    status: 'draft',
    current_participants: 0,
  },
]

export const mockFriends: Friend[] = [
  { id: 'u_002', nickname: '山野同频', remark_name: '徒步搭子', group_tags: ['户外', '周末'] },
  { id: 'u_003', nickname: '小桌游局', group_tags: ['桌游'] },
  { id: 'u_004', nickname: '镜头漫游', remark_name: '摄影朋友', group_tags: ['摄影', '城市探索'] },
]

export const mockFriendRequests: FriendRequest[] = [
  { id: 'fr_001', nickname: '咖啡因观察员', message: '我们都报名了城市摄影散步，认识一下？', created_at: '06-30 10:20' },
  { id: 'fr_002', nickname: '周末不宅', message: '想一起参加徒步活动。', created_at: '06-29 21:12' },
]

export const mockTeams: Team[] = [
  {
    id: 'team_001',
    name: '周末徒步小队',
    description: '每周末找一条轻松路线，适合新手和恢复运动的人。',
    interest_tags: ['户外', '徒步'],
    join_type: 'review',
    current_members: 36,
    max_members: 50,
  },
  {
    id: 'team_002',
    name: '下班桌游会',
    description: '工作日晚上也能轻松开局，主打规则友好和低压力。',
    interest_tags: ['桌游', '交友'],
    join_type: 'public',
    current_members: 18,
    max_members: 30,
  },
]

export const mockReviews: Review[] = [
  { id: 'rv_001', nickname: '李四', content: '组织节奏很好，新人也不会尴尬。', created_at: '06-28' },
  { id: 'rv_002', nickname: '王五', content: '路线轻松，集合点也很清楚。', created_at: '06-27' },
]
