<template>
  <view class="page" v-if="activity">
    <!-- 封面区 -->
    <view class="hero">
      <image v-if="activity.cover_image_url" :src="activity.cover_image_url" class="hero-img" mode="aspectFill" />
      <text v-else class="hero-type">{{ activity.activity_type }}</text>
    </view>

    <view class="content">
      <!-- 标题 + 状态 -->
      <view class="title-row">
        <text class="title">{{ activity.title }}</text>
        <activity-status-tag :status="activity.status" />
      </view>

      <tag-list :tags="activity.tags" />
      <text class="desc">{{ activity.description }}</text>

      <!-- 信息卡片 -->
      <view class="info">
        <view class="info-row">
          <text class="info-label">时间</text>
          <text class="info-value">{{ activity.start_time }} - {{ activity.end_time }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">报名截止</text>
          <text class="info-value">{{ activity.registration_deadline }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">地点</text>
          <text class="info-value">{{ activity.location_name }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">人数</text>
          <text class="info-value">{{ formatCapacity(activity.current_participants, activity.max_participants) }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">费用</text>
          <text class="info-value">{{ formatFee(activity.fee_type, activity.fee_amount) }}</text>
        </view>
      </view>

      <!-- 地图缩略图 -->
      <view class="map-thumb" @tap="openMap">
        <map
          class="thumb-map"
          :latitude="activity.location_lat"
          :longitude="activity.location_lng"
          :markers="thumbMarker"
          :scale="15"
          :enable-zoom="false"
          :enable-scroll="false"
        />
        <text class="map-hint">点击查看地图</text>
      </view>

      <!-- 发起人 -->
      <view class="creator-row" @tap="goToCreator">
        <view class="creator-avatar">
          <image v-if="activity.creator?.avatar_url" :src="activity.creator.avatar_url" mode="aspectFill" class="avatar-img" />
          <text v-else class="avatar-text">{{ creatorInitial }}</text>
        </view>
        <view class="creator-info">
          <text class="creator-name">{{ activity.creator?.nickname }}</text>
          <text class="creator-label">活动发起人</text>
        </view>
        <uni-icons type="right" size="16" color="#9ca3af" />
      </view>

      <!-- 参与要求 -->
      <view v-if="activity.min_credit_score || activity.min_age" class="requirements">
        <text class="req-title">参与要求</text>
        <text v-if="activity.min_credit_score" class="req-item">信誉分 ≥ {{ activity.min_credit_score }}</text>
        <text v-if="activity.min_age" class="req-item">年龄 ≥ {{ activity.min_age }} 岁</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <!-- 草稿/驳回：创建者可编辑 -->
      <button v-if="showEditBtn" class="btn-edit" @tap="goToEdit">{{ activity.status === 'rejected' ? '编辑并重新提交' : '编辑草稿' }}</button>

      <!-- 已下架 -->
      <button v-else-if="btnState === 'taken_down'" class="btn-disabled">活动已下架</button>

      <!-- 已结束 -->
      <button v-else-if="btnState === 'ended'" class="btn-disabled">活动已结束</button>

      <!-- 报名已截止 -->
      <button v-else-if="btnState === 'deadline_passed'" class="btn-disabled">报名已截止</button>

      <!-- 已报名（未截止）-->
      <button v-else-if="btnState === 'registered'" class="btn-cancel" @tap="cancelJoin">取消报名</button>

      <!-- 已满员 -->
      <button v-else-if="btnState === 'full'" class="btn-wait" @tap="joinWaitlist">加入等待队列</button>

      <!-- 可报名 -->
      <button v-else-if="btnState === 'can_register'" class="btn-primary" @tap="navigateTo(`${routes.registrationConfirm}?id=${activity.id}`)">立即报名</button>

      <!-- 默认/未知 -->
      <button v-else class="btn-disabled">暂不可报名</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import ActivityStatusTag from '../../components/activity-status-tag.vue'
import TagList from '../../components/tag-list.vue'
import { getActivityDetail } from '../../services/discover'
import { cancelRegistration, joinWaitlist as joinActivityWaitlist } from '../../services/activity'
import type { Activity } from '../../types/domain'
import { formatCapacity, formatFee } from '../../utils/format'
import { navigateTo, routes } from '../../utils/routes'
import { useAuthStore } from '../../stores/auth'

const activity = ref<Activity | null>(null)

onLoad(async (query) => {
  if (query?.id) {
    try {
      const result = await getActivityDetail(query.id as string)
      activity.value = result.data
    } catch { /* handle error */ }
  }
})

const a = computed(() => activity.value!)

const creatorInitial = computed(() => a.value.creator?.nickname?.slice(0, 1) || '?')

const thumbMarker = computed(() => [
  {
    id: 1,
    latitude: a.value.location_lat,
    longitude: a.value.location_lng,
    iconPath: '/static/map-marker.png',
    width: 24,
    height: 24,
  },
])

// ---- 按钮状态机 ----
type BtnState = 'can_register' | 'registered' | 'full' | 'deadline_passed' | 'ended' | 'taken_down'

const btnState = computed<BtnState>(() => {
  const s = a.value.status
  const joined = a.value.joined

  // 已下架
  if (s === 'taken_down') return 'taken_down'

  // 已结束
  if (s === 'ended') return 'ended'

  // 报名截止（未到开始时间但过了截止时间，或已处于驳回等）
  if (s === 'pending_ai_review' || s === 'pending_manual_review' || s === 'rejected' || s === 'draft') {
    return 'deadline_passed'
  }

  // 已发布 / 报名中
  if (s === 'published') {
    // 已报名
    if (joined) return 'registered'
    // 满员
    if (a.value.current_participants >= a.value.max_participants) return 'full'
    // 可报名
    return 'can_register'
  }

  return 'deadline_passed'
})

// ---- 当前用户是否为创建者 ----
const auth = useAuthStore()
const isCreator = computed(() => {
  if (!activity.value?.creator?.id || !auth.state.user?.id) return false
  return activity.value.creator.id === auth.state.user.id
})

// 草稿/驳回且是创建者时显示编辑入口
const showEditBtn = computed(() => {
  if (!isCreator.value) return false
  return activity.value?.status === 'draft' || activity.value?.status === 'rejected'
})

// ---- 跳转编辑 ----
function goToEdit() {
  if (!activity.value) return
  uni.setStorageSync('editing_draft', activity.value)
  uni.navigateTo({ url: '/subpkg-activity/create/index' })
}

// ---- 操作 ----
async function cancelJoin() {
  if (!activity.value) return
  uni.showModal({
    title: '确定取消报名？',
    content: '取消后名额将释放给他人。',
    confirmText: '确定取消',
    cancelText: '暂不取消',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelRegistration(activity.value!.id)
          activity.value!.joined = false
          activity.value!.current_participants = Math.max(0, activity.value!.current_participants - 1)
          uni.showToast({ title: '已取消报名', icon: 'success' })
        } catch {
          uni.showToast({ title: '取消失败，请重试', icon: 'none' })
        }
      }
    },
  })
}

async function joinWaitlist() {
  if (!activity.value) return
  try {
    const result = await joinActivityWaitlist(activity.value.id)
    uni.showToast({ title: `已加入等待队列，前方 ${result.data?.waiting_count_ahead ?? '?'} 人`, icon: 'success' })
  } catch {
    uni.showToast({ title: '加入等待队列失败', icon: 'none' })
  }
}

function openMap() {
  navigateTo(`${routes.activityMap}`)
}

function goToCreator() {
  const id = activity.value?.creator?.id
  if (id) {
    navigateTo(`${routes.publicProfile}?id=${id}`)
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding-bottom: 160rpx;
  background: #f6f8f7;
}

.hero {
  height: 420rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
}

.hero-type {
  color: #15803d;
  font-size: 44rpx;
  font-weight: 900;
}

.content {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.title {
  flex: 1;
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
  line-height: 1.35;
}

.desc {
  display: block;
  color: #344054;
  font-size: 28rpx;
  line-height: 1.6;
}

.info {
  display: flex;
  flex-direction: column;
  padding: 26rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 12rpx 0;

  & + & {
    border-top: 1rpx solid #f2f4f7;
  }
}

.info-label {
  flex-shrink: 0;
  width: 120rpx;
  color: #667085;
  font-size: 26rpx;
}

.info-value {
  color: #101828;
  font-size: 26rpx;
  font-weight: 500;
}

.map-thumb {
  position: relative;
  height: 260rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.thumb-map {
  width: 100%;
  height: 100%;
}

.map-hint {
  position: absolute;
  bottom: 12rpx;
  right: 16rpx;
  padding: 6rpx 14rpx;
  border-radius: 8rpx;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 22rpx;
}

.creator-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 22rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.creator-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-text {
  color: #15803d;
  font-size: 36rpx;
  font-weight: 900;
}

.creator-info {
  flex: 1;
}

.creator-name {
  display: block;
  color: #101828;
  font-size: 28rpx;
  font-weight: 700;
}

.creator-label {
  display: block;
  margin-top: 4rpx;
  color: #667085;
  font-size: 24rpx;
}

.requirements {
  padding: 22rpx;
  border-radius: 16rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.req-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #101828;
}

.req-item {
  font-size: 24rpx;
  color: #667085;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 28rpx 40rpx;
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.btn-primary,
.btn-cancel,
.btn-wait,
.btn-disabled,
.btn-edit {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  font-size: 30rpx;
  font-weight: 800;
}

.btn-primary {
  background: #16a34a;
  color: #ffffff;
}

.btn-edit {
  background: #eff6ff;
  color: #2563eb;
}

.btn-cancel {
  background: #fff7ed;
  color: #c2410c;
}

.btn-wait {
  background: #eff6ff;
  color: #2563eb;
}

.btn-disabled {
  background: #f2f4f7;
  color: #9ca3af;
}
</style>
