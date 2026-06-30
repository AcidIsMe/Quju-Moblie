<template>
  <view class="activity-card" @tap="openDetail">
    <view class="cover">
      <text class="cover-mark">趣聚</text>
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
  padding: 22rpx;
  border: 1rpx solid rgba(22, 163, 74, 0.08);
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16rpx 42rpx rgba(15, 23, 42, 0.06);
}

.cover {
  position: relative;
  overflow: hidden;
  width: 156rpx;
  height: 156rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: linear-gradient(145deg, #dcfce7 0%, #ccfbf1 100%);
  color: #047857;
  font-size: 24rpx;
  font-weight: 800;
  text-align: center;
}

.cover::after {
  position: absolute;
  right: -28rpx;
  bottom: -30rpx;
  width: 92rpx;
  height: 92rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.46);
  content: '';
}

.cover-mark {
  color: rgba(4, 120, 87, 0.44);
  font-size: 20rpx;
  font-weight: 900;
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
  font-weight: 850;
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
  font-weight: 750;
}
</style>
