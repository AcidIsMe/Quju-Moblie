<template>
  <view class="page">
    <view class="header">
      <text class="eyebrow">活动总结</text>
      <text class="title">把一次见面留下来</text>
      <text class="desc">支持图片、标签和图文总结的 mock 编辑流程，后续接入上传与 AI 分类。</text>
    </view>

    <view class="panel">
      <label class="field">
        <text>总结标题</text>
        <input v-model="form.title" placeholder="例如：奥森轻徒步复盘" />
      </label>
      <label class="field">
        <text>活动回顾</text>
        <textarea v-model="form.content" placeholder="记录路线、氛围、照片亮点和下次建议" />
      </label>
      <view class="field">
        <text>照片墙</text>
        <view class="photos">
          <view v-for="photo in photos" :key="photo" class="photo">{{ photo }}</view>
          <view class="photo add" @tap="addPhoto">+</view>
        </view>
      </view>
      <view class="field">
        <text>总结标签</text>
        <view class="chips">
          <view v-for="tag in tags" :key="tag" class="chip">{{ tag }}</view>
        </view>
      </view>
    </view>

    <button class="primary-action" @tap="publish">发布总结</button>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  title: '周末奥森轻徒步回顾',
  content: '整体节奏轻松，路线适合新手。大家在南园集合后沿湖走了一圈，活动结束后有 9 位同学一起拼饭交流。',
})
const photos = ref(['封面', '路线', '合影'])
const tags = ['户外', '徒步', '轻松局']

function addPhoto() {
  photos.value.push(`照片${photos.value.length + 1}`)
}

function publish() {
  if (!form.title.trim() || !form.content.trim()) {
    uni.showToast({ title: '请补充总结内容', icon: 'none' })
    return
  }
  uni.showModal({
    title: '总结已发布',
    content: '当前为 mock 发布流程，后续会写入活动总结接口。',
    showCancel: false,
  })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 30rpx 28rpx;
  background: #f4f7f5;
}

.header {
  padding: 32rpx;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.22), transparent 36%),
    linear-gradient(135deg, #102820, #166534);
  color: #ffffff;
}

.eyebrow,
.title,
.desc {
  display: block;
}

.eyebrow {
  color: #bbf7d0;
  font-size: 24rpx;
  font-weight: 900;
}

.title {
  margin-top: 10rpx;
  font-size: 42rpx;
  font-weight: 900;
}

.desc {
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.78);
  font-size: 26rpx;
  line-height: 1.5;
}

.panel {
  padding: 28rpx;
  margin-bottom: 26rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.field {
  display: block;
  margin-bottom: 26rpx;
}

.field > text {
  display: block;
  margin-bottom: 12rpx;
  color: #344054;
  font-size: 25rpx;
  font-weight: 900;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 18rpx;
  background: #f8faf9;
  color: #101828;
  font-size: 27rpx;
}

input {
  height: 86rpx;
  padding: 0 22rpx;
}

textarea {
  height: 220rpx;
  padding: 20rpx 22rpx;
  line-height: 1.5;
}

.photos,
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.photo {
  width: 146rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #ecfdf3, #ccfbf1);
  color: #15803d;
  font-size: 25rpx;
  font-weight: 900;
}

.photo.add {
  border: 2rpx dashed #86efac;
  background: #ffffff;
  font-size: 42rpx;
}

.chip {
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: #dcfce7;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
