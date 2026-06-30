<template>
  <view class="page">
    <!-- 顶部 -->
    <view class="topbar">
      <view>
        <text class="hello">今天想参加什么？</text>
        <text class="city">{{ cityText }}</text>
      </view>
      <button class="search" @tap="navigateTo(routes.activitySearch)">搜索</button>
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
      <button @tap="navigateTo(routes.activityMap)">地图模式</button>
      <button @tap="navigateTo(routes.myJoined)">我报名的</button>
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
  background: #f6f8f7;
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
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 26rpx;
}

.tabs,
.quick-actions {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.tab,
.quick-actions button {
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #475467;
  font-size: 26rpx;
}

.tab.active {
  background: #16a34a;
  color: #ffffff;
  font-weight: 700;
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
