<template>
  <view class="page">
    <view class="profile">
      <view class="avatar">{{ profile.nickname.slice(0, 1) }}</view>
      <text class="name">{{ profile.nickname }}</text>
      <text class="bio">{{ profile.bio }}</text>
      <tag-list :tags="profile.interest_tags" />
      <view class="stats">
        <view>
          <text class="num">12</text>
          <text class="label">活动</text>
        </view>
        <view>
          <text class="num">86</text>
          <text class="label">关注者</text>
        </view>
        <view>
          <text class="num">{{ profile.credit_score }}</text>
          <text class="label">信用分</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="ghost" @tap="addFriend">{{ requested ? '已申请' : '加好友' }}</button>
      <button class="primary-action" @tap="follow">{{ followed ? '已关注' : '关注' }}</button>
    </view>

    <view class="section-title">公开活动</view>
    <activity-card v-for="activity in activities" :key="activity.id" :activity="activity" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ActivityCard from '../../components/activity-card.vue'
import TagList from '../../components/tag-list.vue'
import { mockActivities, mockUser } from '../../mocks/activities'

const requested = ref(false)
const followed = ref(false)
const profile = {
  ...mockUser,
  nickname: '山野同频',
  bio: '周末组织轻徒步，也喜欢城市里慢慢走。',
  interest_tags: ['户外', '徒步', '城市探索'],
}

const activities = computed(() => mockActivities.slice(0, 2))

function addFriend() {
  requested.value = true
  uni.showToast({ title: '好友申请已发送', icon: 'success' })
}

function follow() {
  followed.value = true
  uni.showToast({ title: '已关注', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 30rpx 28rpx;
  background: #f4f7f5;
}

.profile {
  padding: 36rpx 30rpx;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at 15% 0%, rgba(250, 204, 21, 0.22), transparent 28%),
    linear-gradient(135deg, #ffffff, #f0fdfa);
  text-align: center;
  box-shadow: 0 18rpx 50rpx rgba(15, 23, 42, 0.08);
}

.avatar {
  width: 126rpx;
  height: 126rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18rpx;
  border-radius: 50%;
  background: #101828;
  color: #ffffff;
  font-size: 52rpx;
  font-weight: 900;
}

.name,
.bio {
  display: block;
}

.name {
  color: #101828;
  font-size: 40rpx;
  font-weight: 900;
}

.bio {
  margin: 12rpx 0 14rpx;
  color: #667085;
  font-size: 27rpx;
  line-height: 1.5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  margin-top: 24rpx;
}

.stats view {
  padding: 16rpx 8rpx;
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.72);
}

.num,
.label {
  display: block;
}

.num {
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.label {
  margin-top: 4rpx;
  color: #98a2b3;
  font-size: 22rpx;
}

.actions {
  display: flex;
  gap: 18rpx;
  margin: 24rpx 0;
}

.actions button {
  flex: 1;
}

.ghost {
  height: 86rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #15803d;
  font-size: 28rpx;
  font-weight: 900;
}

.section-title {
  margin: 26rpx 0 16rpx;
  color: #101828;
  font-size: 32rpx;
  font-weight: 900;
}
</style>
