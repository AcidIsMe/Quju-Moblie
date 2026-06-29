<template>
  <view class="page">
    <view class="hero">
      <text class="type">{{ activity.activity_type }}</text>
    </view>
    <view class="content">
      <view class="title-row">
        <text class="title">{{ activity.title }}</text>
        <activity-status-tag :status="activity.status" />
      </view>
      <tag-list :tags="activity.tags" />
      <text class="desc">{{ activity.description }}</text>

      <view class="info">
        <text>时间：{{ activity.start_time }} - {{ activity.end_time }}</text>
        <text>地点：{{ activity.location_name }}</text>
        <text>人数：{{ formatCapacity(activity.current_participants, activity.max_participants) }}</text>
        <text>费用：{{ formatFee(activity.fee_type, activity.fee_amount) }}</text>
        <text>发起人：{{ activity.creator?.nickname }}</text>
      </view>
    </view>

    <view class="bottom-bar">
      <button v-if="activity.joined" class="secondary" @tap="cancelJoin">取消报名</button>
      <button v-else class="primary" @tap="navigateTo(`${routes.registrationConfirm}?id=${activity.id}`)">立即报名</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ActivityStatusTag from '../../components/activity-status-tag.vue'
import TagList from '../../components/tag-list.vue'
import { findMockActivity } from '../../services/discover'
import type { Activity } from '../../types/domain'
import { formatCapacity, formatFee } from '../../utils/format'
import { navigateTo, routes } from '../../utils/routes'

const activity = ref<Activity>(findMockActivity())

onLoad((query) => {
  activity.value = findMockActivity(query?.id as string)
})

function cancelJoin() {
  activity.value.joined = false
  uni.showToast({ title: '已取消报名', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

.hero {
  height: 360rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dcfce7;
}

.type {
  color: #15803d;
  font-size: 44rpx;
  font-weight: 900;
}

.content {
  padding: 32rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.title {
  flex: 1;
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
  line-height: 1.35;
}

.desc {
  display: block;
  margin-top: 28rpx;
  color: #344054;
  font-size: 28rpx;
  line-height: 1.6;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 32rpx;
  padding: 26rpx;
  border-radius: 16rpx;
  background: #ffffff;
  color: #475467;
  font-size: 26rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 28rpx 40rpx;
  background: #ffffff;
}

.primary,
.secondary {
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  font-size: 30rpx;
  font-weight: 800;
}

.primary {
  background: #16a34a;
  color: #ffffff;
}

.secondary {
  background: #fff7ed;
  color: #c2410c;
}
</style>
