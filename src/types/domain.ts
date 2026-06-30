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
  created_at?: string
}

/** 公开用户主页信息 */
export interface PublicUserProfile extends UserProfile {
  friendship_status?: 'pending' | 'accepted' | 'blocked' | null
  follow_status?: 'following' | 'followed' | 'mutual' | null
  stats?: {
    activity_count: number
    follower_count: number
    following_count: number
  }
}

export type ActivityRegistrationStatus = 'not_registered' | 'registered' | 'cancelled' | 'checked_in' | 'in_waitlist'
export type ActivityDisplayStatus = 'not_started' | 'registering' | 'registration_closed' | 'in_progress' | 'ended' | 'taken_down'

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
  /** 后端返回的标准化报名状态 */
  registration_status?: ActivityRegistrationStatus
  /** 后端返回的前端展示状态标识 */
  display_status?: ActivityDisplayStatus
  review_reason?: string
  is_team_activity?: boolean
  team_id?: string
  created_at?: string
  /** 前端便捷属性：是否已报名（由 registration_status 派生） */
  joined?: boolean
}

export interface NotificationItem {
  id: string
  type: string
  title: string
  content: string
  is_read: boolean
  created_at: string
  metadata?: Record<string, unknown>
}

// 分页相关类型已统一迁移至 services/http.ts 的 ApiResponse<T> 和 RequestResult<T>
