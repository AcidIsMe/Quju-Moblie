<template>
  <view class="page">
    <view v-for="item in participants" :key="item.name" class="person">
      <view class="avatar">{{ item.name.slice(0, 1) }}</view>
      <view>
        <text class="name">{{ item.name }}</text>
        <text class="status">{{ item.checked ? '已签到' : '未签到' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { request } from '../../services/http'

interface Participant {
  name: string
  checked: boolean
}

const participants = ref<Participant[]>([])
const activityId = ref('')

onLoad((options: any) => {
  activityId.value = options?.id || ''
})

onMounted(async () => {
  if (!activityId.value) return
  try {
    const res = await request<any[]>({
      url: `/activities/${activityId.value}/participants`,
      method: 'GET',
    })
    participants.value = (res.data || []).map((item: any) => ({
      name: item.user?.nickname || item.user_id || '未知用户',
      checked: !!item.checked_in_at,
    }))
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
})
</script>

<style scoped lang="scss">
.page {
  padding: 28rpx;
}

.person {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 14rpx;
  background: #ffffff;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  font-weight: 900;
}

.name,
.status {
  display: block;
}

.name {
  color: #101828;
  font-size: 28rpx;
  font-weight: 800;
}

.status {
  color: #667085;
  font-size: 24rpx;
}
</style>
