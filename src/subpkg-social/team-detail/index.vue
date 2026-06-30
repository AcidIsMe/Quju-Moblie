<template>
  <view class="page">
    <view class="hero">
      <view class="hero-main">
        <text class="eyebrow">{{ team.join_type === 'public' ? '公开小队' : '审核加入' }}</text>
        <text class="title">{{ team.name }}</text>
        <text class="desc">{{ team.description }}</text>
        <tag-list :tags="team.interest_tags" />
      </view>
      <view class="member-ring">
        <text class="count">{{ team.current_members }}</text>
        <text class="label">成员</text>
      </view>
    </view>

    <view class="stats">
      <view class="stat">
        <text class="value">{{ team.max_members }}</text>
        <text class="label">人数上限</text>
      </view>
      <view class="stat">
        <text class="value">{{ activeActivities.length }}</text>
        <text class="label">近期活动</text>
      </view>
      <view class="stat">
        <text class="value">{{ team.join_type === 'public' ? '直接' : '审核' }}</text>
        <text class="label">加入方式</text>
      </view>
    </view>

    <view class="panel">
      <view class="panel-title">
        <text>成员预览</text>
        <text class="hint">共 {{ team.current_members }} 人</text>
      </view>
      <view class="members">
        <view v-for="friend in members" :key="friend.id" class="member" @tap="navigateTo(`${routes.publicProfile}?id=${friend.id}`)">
          <view class="avatar">{{ friend.nickname.slice(0, 1) }}</view>
          <text>{{ friend.remark_name || friend.nickname }}</text>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="panel-title">
        <text>小队活动</text>
        <text class="hint">mock 数据</text>
      </view>
      <activity-card v-for="activity in activeActivities" :key="activity.id" :activity="activity" />
    </view>

    <view class="bottom-bar">
      <button class="ghost" @tap="shareTeam">分享</button>
      <button class="primary-action" @tap="joinTeam">{{ joined ? '已加入' : '申请加入' }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ActivityCard from '../../components/activity-card.vue'
import TagList from '../../components/tag-list.vue'
import { mockActivities, mockFriends, mockTeams } from '../../mocks/activities'
import { navigateTo, routes } from '../../utils/routes'

const joined = ref(false)
const team = mockTeams[0]
const members = mockFriends

const activeActivities = computed(() =>
  mockActivities.slice(0, 2).map((activity) => ({
    ...activity,
    is_team_activity: true,
    team_id: team.id,
  })),
)

function joinTeam() {
  joined.value = true
  uni.showToast({
    title: team.join_type === 'public' ? '已加入小队' : '申请已提交',
    icon: 'success',
  })
}

function shareTeam() {
  uni.showToast({ title: '分享能力后续接入', icon: 'none' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  background: #f4f7f5;
}

.hero {
  display: flex;
  gap: 24rpx;
  padding: 34rpx;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at 88% 0%, rgba(20, 184, 166, 0.18), transparent 34%),
    linear-gradient(135deg, #ffffff, #eefbf4);
  box-shadow: 0 18rpx 48rpx rgba(15, 23, 42, 0.08);
}

.hero-main {
  flex: 1;
}

.eyebrow,
.title,
.desc {
  display: block;
}

.eyebrow {
  color: #15803d;
  font-size: 24rpx;
  font-weight: 900;
}

.title {
  margin-top: 12rpx;
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
}

.desc {
  margin-top: 14rpx;
  color: #475467;
  font-size: 27rpx;
  line-height: 1.55;
}

.member-ring {
  width: 130rpx;
  height: 130rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #101828;
  color: #ffffff;
}

.count {
  font-size: 34rpx;
  font-weight: 900;
}

.label {
  font-size: 22rpx;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  margin: 22rpx 0;
}

.stat {
  padding: 22rpx 10rpx;
  border-radius: 20rpx;
  background: #ffffff;
  text-align: center;
}

.value {
  display: block;
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.panel {
  padding: 26rpx;
  margin-bottom: 20rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.hint {
  color: #98a2b3;
  font-size: 23rpx;
  font-weight: 700;
}

.members {
  display: flex;
  gap: 18rpx;
  overflow-x: auto;
}

.member {
  width: 132rpx;
  flex-shrink: 0;
  text-align: center;
  color: #475467;
  font-size: 23rpx;
}

.avatar {
  width: 84rpx;
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7, #ccfbf1);
  color: #047857;
  font-size: 32rpx;
  font-weight: 900;
}

.bottom-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 18rpx;
  padding: 18rpx 28rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 -12rpx 32rpx rgba(15, 23, 42, 0.08);
}

.bottom-bar button {
  flex: 1;
}

.ghost {
  height: 86rpx;
  border-radius: 999rpx;
  background: #eefbf4;
  color: #15803d;
  font-size: 28rpx;
  font-weight: 900;
}
</style>
