<template>
  <view class="page">
    <view class="summary">
      <view>
        <text class="eyebrow">NOTIFICATIONS</text>
        <text class="title">消息中心</text>
        <text class="subtitle">{{ unreadCount ? `你有 ${unreadCount} 条未读消息` : '所有消息都已处理' }}</text>
      </view>
      <button class="read-all" @tap="markAllRead">
        <uni-icons type="checkbox-filled" size="18" color="#15803d" />
      </button>
    </view>

    <view class="filters">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="filter"
        :class="{ active: currentTab === tab.value }"
        @tap="currentTab = tab.value"
      >
        <text>{{ tab.label }}</text>
        <text v-if="tab.count" class="count">{{ tab.count }}</text>
      </view>
    </view>

    <view v-if="filteredNotifications.length" class="list">
      <view
        v-for="item in filteredNotifications"
        :key="item.id"
        class="notice"
        :class="{ unread: !item.is_read }"
        @tap="markRead(item.id)"
      >
        <view class="icon" :class="noticeMeta(item.type).className">
          <uni-icons :type="noticeMeta(item.type).icon" size="22" color="#ffffff" />
        </view>
        <view class="body">
          <view class="row">
            <text class="notice-title">{{ item.title }}</text>
            <view v-if="!item.is_read" class="dot" />
          </view>
          <text class="content">{{ item.content }}</text>
          <view class="meta">
            <text>{{ noticeMeta(item.type).label }}</text>
            <text>{{ item.created_at }}</text>
          </view>
        </view>
      </view>
    </view>

    <empty-state v-else title="暂无消息" description="当前分类下没有新的消息。" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { getNotifications, markRead as markReadApi } from '../../services/notification'
import type { NotificationItem } from '../../types/domain'

type NoticeTab = 'all' | 'unread' | 'activity' | 'system'

const currentTab = ref<NoticeTab>('all')
const notifications = ref<NotificationItem[]>([])

onMounted(async () => {
  try {
    const result = await getNotifications()
    notifications.value = result.data
  } catch { /* silent */ }
})
const unreadCount = computed(() => notifications.value.filter((item) => !item.is_read).length)

const tabs = computed(() => [
  { label: '全部', value: 'all' as const, count: notifications.value.length },
  { label: '未读', value: 'unread' as const, count: unreadCount.value },
  { label: '活动', value: 'activity' as const, count: notifications.value.filter((item) => item.type.includes('activity')).length },
  { label: '系统', value: 'system' as const, count: notifications.value.filter((item) => item.type === 'system').length },
])

const filteredNotifications = computed(() => {
  if (currentTab.value === 'unread') return notifications.value.filter((item) => !item.is_read)
  if (currentTab.value === 'activity') return notifications.value.filter((item) => item.type.includes('activity'))
  if (currentTab.value === 'system') return notifications.value.filter((item) => item.type === 'system')
  return notifications.value
})

function noticeMeta(type: string) {
  if (type.includes('activity')) {
    return { icon: 'calendar-filled', label: '活动通知', className: 'activity' }
  }
  return { icon: 'notification-filled', label: '系统消息', className: 'system' }
}

async function markRead(id: string) {
  const item = notifications.value.find((notice) => notice.id === id)
  if (item) item.is_read = true
  try {
    await markReadApi(id)
  } catch { /* silent */ }
}

function markAllRead() {
  notifications.value.forEach((item) => {
    item.is_read = true
  })
  uni.showToast({ title: '已全部标记已读', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 30rpx 28rpx;
  background: #f4f7f5;
}

.summary {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 34rpx;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.22), transparent 36%),
    linear-gradient(135deg, #102820, #166534);
  box-shadow: 0 18rpx 48rpx rgba(22, 101, 52, 0.18);
}

.eyebrow,
.title,
.subtitle {
  display: block;
}

.eyebrow {
  color: #bbf7d0;
  font-size: 22rpx;
  font-weight: 900;
}

.title {
  margin-top: 12rpx;
  color: #ffffff;
  font-size: 44rpx;
  font-weight: 900;
}

.subtitle {
  margin-top: 10rpx;
  color: rgba(255, 255, 255, 0.76);
  font-size: 25rpx;
}

.read-all {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.9);
}

.filters {
  display: flex;
  gap: 14rpx;
  margin: 26rpx 0 22rpx;
  overflow-x: auto;
}

.filter {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #667085;
  font-size: 25rpx;
  font-weight: 800;
}

.filter.active {
  background: #16a34a;
  color: #ffffff;
}

.count {
  min-width: 30rpx;
  height: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  background: rgba(15, 23, 42, 0.08);
  font-size: 19rpx;
}

.filter.active .count {
  background: rgba(255, 255, 255, 0.22);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.notice {
  display: flex;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 34rpx rgba(15, 23, 42, 0.05);
}

.notice.unread {
  box-shadow: 0 16rpx 40rpx rgba(22, 163, 74, 0.1);
}

.icon {
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 22rpx;
}

.icon.activity {
  background: linear-gradient(135deg, #16a34a, #0f766e);
}

.icon.system {
  background: linear-gradient(135deg, #2563eb, #14b8a6);
}

.body {
  flex: 1;
  min-width: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.notice-title {
  flex: 1;
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  flex-shrink: 0;
  border-radius: 50%;
  background: #ef4444;
}

.content {
  display: block;
  margin-top: 10rpx;
  color: #475467;
  font-size: 26rpx;
  line-height: 1.45;
}

.meta {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  margin-top: 16rpx;
  color: #98a2b3;
  font-size: 22rpx;
}
</style>
