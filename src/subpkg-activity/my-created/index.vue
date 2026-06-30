<template>
  <view class="page">
    <activity-card v-for="activity in activities" :key="activity.id" :activity="activity" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ActivityCard from '../../components/activity-card.vue'
import { getMyCreatedActivities } from '../../services/user'
import type { Activity } from '../../types/domain'

const activities = ref<Activity[]>([])

onMounted(async () => {
  try {
    const result = await getMyCreatedActivities()
    activities.value = result.data
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
