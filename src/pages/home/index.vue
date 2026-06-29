<template>
  <view class="page">
    <view class="topbar">
      <view>
        <text class="hello">今天想参加什么？</text>
        <text class="city">北京 · 已为你推荐附近活动</text>
      </view>
      <button class="search" @tap="navigateTo(routes.activitySearch)">搜索</button>
    </view>

    <view class="tabs">
      <button
        v-for="item in tabs"
        :key="item.value"
        class="tab"
        :class="{ active: currentTab === item.value }"
        @tap="currentTab = item.value"
      >
        {{ item.label }}
      </button>
    </view>

    <view class="quick-actions">
      <button @tap="navigateTo(routes.activityMap)">地图模式</button>
      <button @tap="navigateTo(routes.myJoined)">我报名的</button>
    </view>

    <view class="list">
      <activity-card v-for="activity in activities" :key="activity.id" :activity="activity" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ActivityCard from '../../components/activity-card.vue'
import { getMockActivities, type DiscoverTab } from '../../services/discover'
import { useAuthStore } from '../../stores/auth'
import { navigateTo, routes } from '../../utils/routes'

const tabs: { label: string; value: DiscoverTab }[] = [
  { label: '推荐', value: 'recommended' },
  { label: '最新', value: 'latest' },
  { label: '附近', value: 'nearby' },
]

const currentTab = ref<DiscoverTab>('recommended')
const activities = computed(() => getMockActivities(currentTab.value))

onShow(() => {
  useAuthStore().restore()
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
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
</style>
