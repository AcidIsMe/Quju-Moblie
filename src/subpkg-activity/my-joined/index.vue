<template>
  <view class="page">
    <activity-card v-for="activity in activities" :key="activity.id" :activity="{ ...activity, joined: true }" />
  </view>
</template>

<script setup lang="ts">
import ActivityCard from '../../components/activity-card.vue'
import { mockActivities } from '../../mocks/activities'

const activities = mockActivities.slice(0, 2)
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
