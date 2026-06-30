<template>
  <view class="page">
    <view class="hero-card">
      <view class="hero-top">
        <text class="eyebrow">QUJU WEEKEND</text>
        <view class="hero-icon">
          <uni-icons type="map-filled" size="24" color="#ffffff" />
        </view>
      </view>
      <text class="hero-title">把兴趣变成一次见面</text>
      <text class="hero-copy">精选同城活动、地图发现和轻量报名流程，先从一个周末开始。</text>
      <view class="hero-stats">
        <view>
          <text class="stat-value">3</text>
          <text class="stat-label">精选活动</text>
        </view>
        <view>
          <text class="stat-value">56</text>
          <text class="stat-label">可报名名额</text>
        </view>
        <view>
          <text class="stat-value">4.8</text>
          <text class="stat-label">体验评分</text>
        </view>
      </view>
    </view>

    <!-- 顶部 -->
    <view class="topbar">
      <view>
        <text class="hello">今天想参加什么？</text>
        <text class="city">{{ cityText }}</text>
      </view>
      <button class="search" @tap="navigateTo(routes.activitySearch)">
        <uni-icons type="search" size="18" color="#15803d" />
      </button>
    </view>

    <!-- Tab 切换 -->
    <view class="tabs">
      <button
        v-for="item in tabs"
        :key="item.value"
        class="tab"
        :class="{ active: currentTab === item.value }"
        @tap="switchTab(item.value)"
      >
        {{ item.label }}
      </button>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="quick-card map" @tap="navigateTo(routes.activityMap)">
        <view class="quick-icon">
          <uni-icons type="map-filled" size="24" color="#ffffff" />
        </view>
        <view class="quick-body">
          <text class="quick-title">地图发现</text>
          <text class="quick-desc">按位置查看附近活动</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
      <view class="quick-card joined" @tap="navigateTo(routes.myJoined)">
        <view class="quick-icon">
          <uni-icons type="calendar-filled" size="24" color="#ffffff" />
        </view>
        <view class="quick-body">
          <text class="quick-title">我的报名</text>
          <text class="quick-desc">查看待参加和签到</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
    </view>

    <!-- 附近未授权提示 -->
    <view v-if="currentTab === 'nearby' && !locationAuthorized" class="permission-tip" @tap="requestLocation">
      <text>开启位置权限后，可查看附近活动</text>
      <text class="tip-action">去开启</text>
    </view>

    <!-- 首次加载中 -->
    <view v-if="loading && activities.length === 0" class="loading-state">
      <text>正在加载活动...</text>
    </view>

    <!-- 空状态 -->
    <empty-state
      v-else-if="!loading && activities.length === 0"
      title="暂无活动"
      :description="currentTab === 'nearby' ? '附近暂无可报名的活动，换个区域试试' : '暂时没有发现活动，稍后再来看看'"
    />

    <!-- 列表 -->
    <view v-else class="list">
      <activity-card v-for="activity in activities" :key="activity.id" :activity="activity" />

      <!-- 底部加载状态 -->
      <view v-if="loadingMore" class="load-more">
        <text>加载中...</text>
      </view>
      <view v-else-if="!hasMore && activities.length > 0" class="load-more">
        <text>— 没有更多活动了 —</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import ActivityCard from '../../components/activity-card.vue'
import EmptyState from '../../components/empty-state.vue'
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { getMockActivities, type DiscoverTab } from '../../services/discover'
import { useAuthStore } from '../../stores/auth'
import { useLocationStore } from '../../stores/location'
import { navigateTo, routes } from '../../utils/routes'
import type { Activity } from '../../types/domain'

const tabs: { label: string; value: DiscoverTab }[] = [
  { label: '推荐', value: 'recommended' },
  { label: '最新', value: 'latest' },
  { label: '附近', value: 'nearby' },
]

const PAGE_SIZE = 20

const currentTab = ref<DiscoverTab>('recommended')
const activities = ref<Activity[]>([])
const cursor = ref<string | undefined>(undefined)
const hasMore = ref(true)
const loading = ref(false)
const loadingMore = ref(false)
const locationAuthorized = ref(false)

const locationStore = useLocationStore()

const cityText = ref('为你推荐附近活动')

// ---- 首屏加载 + Tab 切换 ----
async function fetchData(reset: boolean) {
  if (reset) {
    cursor.value = undefined
    hasMore.value = true
    activities.value = []
    loading.value = true
  } else {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
  }

  // 模拟网络延迟
  await delay(400)

  const all = getMockActivities(currentTab.value)
  const start = reset ? 0 : activities.value.length
  const page = all.slice(start, start + PAGE_SIZE)

  if (reset) {
    activities.value = page
    loading.value = false
  } else {
    activities.value = [...activities.value, ...page]
    loadingMore.value = false
  }

  hasMore.value = activities.value.length < all.length

  if (reset) {
    uni.stopPullDownRefresh()
  }
}

function switchTab(tab: DiscoverTab) {
  if (currentTab.value === tab) return
  currentTab.value = tab

  // 附近 Tab 检查位置授权
  if (tab === 'nearby') {
    checkLocation()
  }

  fetchData(true)
}

// ---- 位置权限 ----
function checkLocation() {
  locationAuthorized.value = locationStore.state.authorized
  if (!locationAuthorized.value) {
    locationStore.requestLocation()
  }
  updateCityText()
}

function updateCityText() {
  if (locationStore.state.authorized) {
    cityText.value = `${locationStore.state.city} · 已为你推荐附近活动`
  } else {
    cityText.value = '开启位置，发现附近活动'
  }
}

function requestLocation() {
  locationStore.requestLocation()
  setTimeout(() => {
    locationAuthorized.value = locationStore.state.authorized
    updateCityText()
    if (locationAuthorized.value) {
      fetchData(true)
    }
  }, 500)
}

// ---- 生命周期 ----
onShow(() => {
  useAuthStore().restore()
  updateCityText()
})

// 首次加载
fetchData(true)

// 下拉刷新
onPullDownRefresh(() => {
  fetchData(true)
})

// 触底加载更多
onReachBottom(() => {
  fetchData(false)
})

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f4f7f5;
}

.hero-card {
  padding: 34rpx;
  margin-bottom: 26rpx;
  border-radius: 24rpx;
  background:
    linear-gradient(135deg, rgba(22, 163, 74, 0.96), rgba(15, 159, 140, 0.92)),
    #16a34a;
  box-shadow: 0 20rpx 48rpx rgba(15, 159, 140, 0.24);
}

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.18);
}

.eyebrow,
.hero-title,
.hero-copy,
.stat-value,
.stat-label {
  display: block;
}

.eyebrow {
  color: rgba(255, 255, 255, 0.72);
  font-size: 22rpx;
  font-weight: 900;
}

.hero-title {
  margin-top: 12rpx;
  color: #ffffff;
  font-size: 44rpx;
  font-weight: 900;
}

.hero-copy {
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.86);
  font-size: 26rpx;
  line-height: 1.5;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  margin-top: 26rpx;
}

.hero-stats view {
  padding: 16rpx 12rpx;
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.16);
}

.stat-value {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 900;
}

.stat-label {
  margin-top: 4rpx;
  color: rgba(255, 255, 255, 0.76);
  font-size: 20rpx;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.hello {
  display: block;
  color: #101828;
  font-size: 40rpx;
  font-weight: 900;
}

.city {
  display: block;
  margin-top: 8rpx;
  color: #667085;
  font-size: 24rpx;
}

.search {
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 10rpx 26rpx rgba(15, 23, 42, 0.06);
}

.quick-actions {
  margin-bottom: 24rpx;
}

.tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.tab,
.quick-card {
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #475467;
  font-size: 26rpx;
}

.tab.active {
  background: linear-gradient(135deg, #16a34a, #0f9f8c);
  color: #ffffff;
  font-weight: 700;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 14rpx;
  min-width: 0;
  padding: 22rpx;
  border-radius: 22rpx;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.05);
}

.quick-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 18rpx;
}

.quick-card.map .quick-icon {
  background: linear-gradient(135deg, #16a34a, #0f766e);
}

.quick-card.joined .quick-icon {
  background: linear-gradient(135deg, #2563eb, #14b8a6);
}

.quick-body {
  flex: 1;
  min-width: 0;
}

.quick-title,
.quick-desc {
  display: block;
}

.quick-title {
  color: #101828;
  font-size: 27rpx;
  font-weight: 900;
}

.quick-desc {
  margin-top: 4rpx;
  color: #98a2b3;
  font-size: 21rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.permission-tip {
  margin-bottom: 24rpx;
  padding: 24rpx;
  border-radius: 14rpx;
  background: #fff7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c2410c;
  font-size: 26rpx;
}

.tip-action {
  color: #ea580c;
  font-weight: 700;
}

.loading-state {
  padding: 120rpx 40rpx;
  display: flex;
  justify-content: center;
  color: #667085;
  font-size: 28rpx;
}

.load-more {
  padding: 32rpx 0;
  display: flex;
  justify-content: center;
  color: #9ca3af;
  font-size: 24rpx;
}
</style>
