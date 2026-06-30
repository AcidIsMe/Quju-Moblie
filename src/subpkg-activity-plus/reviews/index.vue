<template>
  <view class="page">
    <view class="composer">
      <textarea v-model="content" placeholder="写下这次活动的体验" />
      <button class="primary-action" @tap="submit">提交评价</button>
    </view>

    <view v-for="review in reviews" :key="review.id" class="review">
      <text class="name">{{ review.nickname }}</text>
      <text class="content">{{ review.content }}</text>
      <text class="time">{{ review.created_at }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getReviews, createReview } from '../../services/activity'

const activityId = ref('')
const content = ref('')
const reviews = ref<any[]>([])

onLoad((query) => {
  activityId.value = (query?.id as string) || ''
  if (activityId.value) loadReviews()
})

async function loadReviews() {
  try {
    const result = await getReviews(activityId.value)
    reviews.value = result.data
  } catch { /* silent */ }
}

async function submit() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入评价内容', icon: 'none' })
    return
  }
  try {
    await createReview(activityId.value, content.value)
    content.value = ''
    uni.showToast({ title: '评价成功', icon: 'success' })
    loadReviews()
  } catch (e: any) {
    uni.showToast({ title: e.message || '评价失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f4f7f5;
}

.composer,
.review {
  padding: 24rpx;
  margin-bottom: 18rpx;
  border-radius: 18rpx;
  background: #ffffff;
}

textarea {
  width: 100%;
  height: 160rpx;
  font-size: 27rpx;
}

.name,
.content,
.time {
  display: block;
}

.name {
  color: #101828;
  font-size: 28rpx;
  font-weight: 900;
}

.content {
  margin-top: 10rpx;
  color: #475467;
  font-size: 27rpx;
  line-height: 1.5;
}

.time {
  margin-top: 10rpx;
  color: #98a2b3;
  font-size: 22rpx;
}
</style>
