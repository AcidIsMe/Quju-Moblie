<template>
  <view class="activity-card" @tap="openDetail">
    <view class="cover">
      <text>{{ activity.activity_type }}</text>
    </view>
    <view class="body">
      <view class="title-row">
        <text class="title">{{ activity.title }}</text>
        <activity-status-tag :status="activity.status" />
      </view>
      <text class="desc">{{ activity.description }}</text>
      <tag-list :tags="activity.tags" />
      <view class="meta">
        <text>{{ activity.start_time }}</text>
        <text>{{ activity.location_name }}</text>
      </view>
      <view class="footer">
        <text>{{ formatCapacity(activity.current_participants, activity.max_participants) }}</text>
        <text>{{ formatFee(activity.fee_type, activity.fee_amount) }}</text>
        <text v-if="activity.distance_text">{{ activity.distance_text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Activity } from '../types/domain'
import { formatCapacity, formatFee } from '../utils/format'
import { navigateTo, routes } from '../utils/routes'
import ActivityStatusTag from './activity-status-tag.vue'
import TagList from './tag-list.vue'

const props = defineProps<{
  activity: Activity
}>()

function openDetail() {
  navigateTo(`${routes.activityDetail}?id=${props.activity.id}`)
}
</script>

<style scoped lang="scss">
.activity-card {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  border: 1rpx solid #eef0f2;
  border-radius: 16rpx;
  background: #ffffff;
}

.cover {
  width: 156rpx;
  height: 156rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  background: #dcfce7;
  color: #15803d;
  font-size: 24rpx;
  text-align: center;
}

.body {
  min-width: 0;
  flex: 1;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.title {
  flex: 1;
  color: #111827;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.35;
}

.desc {
  display: block;
  margin-top: 10rpx;
  color: #667085;
  font-size: 24rpx;
  line-height: 1.45;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-top: 12rpx;
  color: #475467;
  font-size: 23rpx;
}

.footer {
  display: flex;
  gap: 18rpx;
  margin-top: 12rpx;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 600;
}
</style>
