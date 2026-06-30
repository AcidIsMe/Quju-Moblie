<template>
  <view class="page">
    <activity-card v-for="activity in activities" :key="activity.id" :activity="{ ...activity, joined: true }" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ActivityCard from '../../components/activity-card.vue'
import { getMyJoinedActivities } from '../../services/user'
import type { Activity } from '../../types/domain'

const activities = ref<Activity[]>([])

onMounted(async () => {
  try {
    const result = await getMyJoinedActivities()
    // 后端返回的是包装对象 { registration_id, activity_id, status, activity: {...} }
    // 需要解包内层 activity 并合并报名信息
    activities.value = (result.data as any[]).map((item: any) => ({
      ...(item.activity || {}),
      id: item.activity?.id || item.activity_id,
      registration_id: item.registration_id,
      registration_status: item.status,
      joined: true,
    })) as Activity[]
  } catch { /* silent */ }
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
