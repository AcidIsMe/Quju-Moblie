<template>
  <view class="page">
    <activity-card v-for="activity in activities" :key="activity.id" :activity="{ ...activity, joined: true }" />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ActivityCard from '../../components/activity-card.vue'
import { getMyJoinedActivities } from '../../services/discover'
import type { Activity } from '../../types/domain'

const activities = ref<Activity[]>([])

onMounted(async () => {
  try {
    const res = await getMyJoinedActivities()
    activities.value = res.data
  } catch (e: any) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  }
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
