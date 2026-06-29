<template>
  <view class="page">
    <view class="search-row">
      <input v-model="keyword" class="input" placeholder="搜索活动名称或标签" confirm-type="search" />
      <button @tap="search">搜索</button>
    </view>
    <view class="tools">
      <button @tap="navigateTo(routes.activityMap)">地图模式</button>
      <button @tap="showFilter">筛选</button>
    </view>
    <view class="list">
      <activity-card v-for="activity in results" :key="activity.id" :activity="activity" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ActivityCard from '../../components/activity-card.vue'
import { mockActivities } from '../../mocks/activities'
import type { Activity } from '../../types/domain'
import { navigateTo, routes } from '../../utils/routes'

const keyword = ref('')
const results = ref<Activity[]>(mockActivities)

function search() {
  if (!keyword.value.trim()) {
    uni.showToast({ title: '请输入关键词', icon: 'none' })
    return
  }
  results.value = mockActivities.filter((item) => item.title.includes(keyword.value) || item.tags.some((tag) => tag.includes(keyword.value)))
}

function showFilter() {
  uni.showToast({ title: '高级筛选将在 P1 接入', icon: 'none' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
}

.search-row,
.tools {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.input {
  flex: 1;
  height: 84rpx;
  padding: 0 24rpx;
  border-radius: 14rpx;
  background: #ffffff;
  font-size: 28rpx;
}

button {
  padding: 0 24rpx;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 26rpx;
}

.tools button {
  background: #ffffff;
  color: #15803d;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
