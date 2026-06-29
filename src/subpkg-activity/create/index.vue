<template>
  <view class="page">
    <input v-model="form.title" class="input" placeholder="活动名称" />
    <textarea v-model="form.description" class="textarea" placeholder="活动简介" />
    <input v-model="form.tags" class="input" placeholder="标签，用逗号分隔" />
    <input v-model="form.startTime" class="input" placeholder="开始时间，例如 2026-07-04 09:00" />
    <input v-model="form.maxParticipants" class="input" type="number" placeholder="人数上限" />
    <button class="location" @tap="navigateTo(routes.locationPicker)">地图选点</button>
    <button class="primary" @tap="submit">提交审核</button>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { navigateTo, routes } from '../../utils/routes'

const form = reactive({
  title: '',
  description: '',
  tags: '',
  startTime: '',
  maxParticipants: '',
})

function submit() {
  if (!form.title || !form.description || Number(form.maxParticipants) <= 0) {
    uni.showToast({ title: '请完整填写活动信息', icon: 'none' })
    return
  }
  uni.showModal({
    title: '已提交',
    content: '活动已进入审核流程。',
    showCancel: false,
    success: () => uni.navigateBack(),
  })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.input,
.textarea {
  padding: 0 24rpx;
  border-radius: 14rpx;
  background: #ffffff;
  font-size: 28rpx;
}

.input {
  height: 88rpx;
}

.textarea {
  height: 220rpx;
  padding-top: 24rpx;
}

.location,
.primary {
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  font-size: 30rpx;
  font-weight: 800;
}

.location {
  background: #ffffff;
  color: #15803d;
}

.primary {
  background: #16a34a;
  color: #ffffff;
}
</style>
