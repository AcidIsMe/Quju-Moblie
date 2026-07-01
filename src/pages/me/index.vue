<template>
  <view class="page">
    <view class="profile" @tap="handleProfileTap">
      <view class="avatar">{{ initial }}</view>
      <view class="info">
        <text class="name">{{ user?.nickname || '未登录' }}</text>
        <text class="bio">{{ user?.bio || '登录后完善资料，发现更同频的活动。' }}</text>
        <view class="badges">
          <text>{{ user ? `信用分 ${user.credit_score || 0}` : '游客模式' }}</text>
          <text>{{ user?.role === 'merchant' ? '商家账号' : '个人账号' }}</text>
        </view>
      </view>
      <uni-icons type="right" size="16" color="rgba(255,255,255,0.72)" />
    </view>

    <view v-if="user" class="tags">
      <text v-for="tag in user.interest_tags || []" :key="tag">{{ tag }}</text>
    </view>

    <view class="stats">
      <view>
        <text class="num">{{ stats.created }}</text>
        <text class="label">发布</text>
      </view>
      <view>
        <text class="num">{{ stats.joined }}</text>
        <text class="label">报名</text>
      </view>
      <view>
        <text class="num">{{ stats.friends }}</text>
        <text class="label">好友</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">活动管理</text>
      <view class="menu-card" @tap="goAuthed(routes.myCreated)">
        <view class="menu-icon green">
          <uni-icons type="compose" size="22" color="#ffffff" />
        </view>
        <view class="menu-body">
          <text class="menu-title">我发布的活动</text>
          <text class="menu-desc">审核状态、报名人数和签到管理</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
      <view class="menu-card" @tap="goAuthed(routes.myJoined)">
        <view class="menu-icon blue">
          <uni-icons type="calendar-filled" size="22" color="#ffffff" />
        </view>
        <view class="menu-body">
          <text class="menu-title">我报名的活动</text>
          <text class="menu-desc">待参加、已签到和历史记录</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
    </view>

    <view class="section">
      <text class="section-title">社交与账号</text>
      <view class="grid">
        <view class="grid-item" @tap="goAuthed(routes.profileEdit)">
          <uni-icons type="person-filled" size="24" color="#15803d" />
          <text>编辑资料</text>
        </view>
        <view class="grid-item" @tap="goAuthed(routes.friends)">
          <uni-icons type="contact-filled" size="24" color="#15803d" />
          <text>好友</text>
        </view>
        <view class="grid-item" @tap="goAuthed(routes.teams)">
          <uni-icons type="staff-filled" size="24" color="#15803d" />
          <text>小队</text>
        </view>
        <view class="grid-item" @tap="goAuthed(routes.merchantRegister)">
          <uni-icons type="shop-filled" size="24" color="#15803d" />
          <text>商家入驻</text>
        </view>
        <view class="grid-item" @tap="goAuthed(routes.changePassword)">
          <uni-icons type="locked-filled" size="24" color="#15803d" />
          <text>修改密码</text>
        </view>
      </view>
    </view>

    <button v-if="user" class="logout" @tap="logout">
      <uni-icons type="undo" size="18" color="#c2410c" />
      <text>退出登录</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { useAuthStore } from '../../stores/auth'
import { getMyCreatedActivities, getMyJoinedActivities, getFriends } from '../../services/user'
import { navigateTo, routes } from '../../utils/routes'

const auth = useAuthStore()
auth.restore()

const stats = reactive({ created: 0, joined: 0, friends: 0 })

async function loadStats() {
  try {
    const [createdRes, joinedRes, friendsRes] = await Promise.all([
      getMyCreatedActivities(undefined, 100),
      getMyJoinedActivities(undefined, 100),
      getFriends(),
    ])
    stats.created = createdRes.data.length
    stats.joined = joinedRes.data.length
    stats.friends = friendsRes.data.length
  } catch { /* 静默失败 */ }
}

onShow(() => {
  auth.restore()
  if (auth.state.user) loadStats()
})

const user = computed(() => auth.state.user)
const initial = computed(() => user.value?.nickname?.slice(0, 1) || '趣')

function goLogin() {
  navigateTo(routes.login)
}

function handleProfileTap() {
  if (!user.value) goLogin()
}

function goAuthed(url: string) {
  if (user.value) {
    navigateTo(url)
    return
  }
  goLogin()
}

function logout() {
  auth.logout()
  uni.showToast({ title: '已退出登录', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 30rpx 28rpx;
  background: #f4f7f5;
}

.profile {
  display: flex;
  align-items: center;
  gap: 22rpx;
  padding: 34rpx;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.2), transparent 34%),
    linear-gradient(135deg, #12372a, #0f766e);
  color: #ffffff;
  box-shadow: 0 18rpx 48rpx rgba(15, 118, 110, 0.18);
}

.avatar {
  width: 118rpx;
  height: 118rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 48rpx;
  font-weight: 900;
}

.info {
  flex: 1;
  min-width: 0;
}

.name,
.bio {
  display: block;
}

.name {
  font-size: 38rpx;
  font-weight: 900;
}

.bio {
  margin-top: 8rpx;
  color: rgba(255, 255, 255, 0.74);
  font-size: 24rpx;
  line-height: 1.4;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 16rpx;
}

.badges text {
  padding: 7rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.16);
  color: #dcfce7;
  font-size: 21rpx;
  font-weight: 800;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin: 20rpx 0;
}

.tags text {
  padding: 9rpx 16rpx;
  border-radius: 999rpx;
  background: #dcfce7;
  color: #15803d;
  font-size: 23rpx;
  font-weight: 800;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14rpx;
  margin: 22rpx 0;
}

.stats view {
  padding: 22rpx 10rpx;
  border-radius: 22rpx;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.num,
.label {
  display: block;
}

.num {
  color: #101828;
  font-size: 34rpx;
  font-weight: 900;
}

.label {
  margin-top: 4rpx;
  color: #98a2b3;
  font-size: 22rpx;
}

.section {
  margin-top: 24rpx;
}

.section-title {
  display: block;
  margin-bottom: 16rpx;
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.menu-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 22rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 34rpx rgba(15, 23, 42, 0.05);
}

.menu-icon {
  width: 74rpx;
  height: 74rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 22rpx;
}

.menu-icon.green {
  background: linear-gradient(135deg, #16a34a, #0f766e);
}

.menu-icon.blue {
  background: linear-gradient(135deg, #2563eb, #14b8a6);
}

.menu-body {
  flex: 1;
  min-width: 0;
}

.menu-title,
.menu-desc {
  display: block;
}

.menu-title {
  color: #101828;
  font-size: 28rpx;
  font-weight: 900;
}

.menu-desc {
  margin-top: 6rpx;
  color: #98a2b3;
  font-size: 23rpx;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14rpx;
}

.grid-item {
  min-height: 132rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border-radius: 22rpx;
  background: #ffffff;
  color: #344054;
  font-size: 23rpx;
  font-weight: 800;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.04);
}

.logout {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  margin-top: 28rpx;
  border-radius: 999rpx;
  background: #fff7ed;
  color: #c2410c;
  font-size: 27rpx;
  font-weight: 900;
}
</style>
