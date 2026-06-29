export type ActivityStatus =
  | 'draft'
  | 'pending_ai_review'
  | 'pending_manual_review'
  | 'published'
  | 'rejected'
  | 'taken_down'
  | 'ended'

export type UserRole = 'personal' | 'merchant' | 'admin'

export interface UserProfile {
  id: string
  nickname: string
  email?: string
  avatar_url?: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  bio?: string
  role: UserRole
  status: 'pending_activation' | 'pending_merchant_review' | 'active' | 'banned'
  credit_score: number
  interest_tags: string[]
}

export interface Activity {
  id: string
  title: string
  description: string
  tags: string[]
  activity_type: string
  cover_image_url?: string
  start_time: string
  end_time: string
  registration_deadline: string
  max_participants: number
  current_participants: number
  min_credit_score: number
  min_age: number
  fee_type: 'free' | 'paid'
  fee_amount: number
  city: string
  location_name: string
  location_lat: number
  location_lng: number
  distance_text?: string
  status: ActivityStatus
  creator?: Pick<UserProfile, 'id' | 'nickname' | 'avatar_url'>
  joined?: boolean
}

export interface NotificationItem {
  id: string
  type: string
  title: string
  content: string
  is_read: boolean
  created_at: string
}

export interface PageResult<T> {
  data: T[]
  pagination: {
    next_cursor?: string
    has_more: boolean
    limit: number
  }
}
