<template>
  <view class="page">
    <view class="intro">
      <text class="eyebrow">创建小队</text>
      <text class="title">把常见搭子沉淀成固定圈子</text>
      <text class="desc">先用 mock 表单完成流程，后续接入小队创建 API 与审核规则。</text>
    </view>

    <view class="form">
      <label class="field">
        <text>小队名称</text>
        <input v-model="form.name" placeholder="例如：周末徒步小队" />
      </label>
      <label class="field">
        <text>小队介绍</text>
        <textarea v-model="form.description" placeholder="说明小队适合什么人、通常做什么活动" />
      </label>
      <view class="field">
        <text>兴趣标签</text>
        <view class="chips">
          <view
            v-for="tag in tagOptions"
            :key="tag"
            class="chip"
            :class="{ active: form.tags.includes(tag) }"
            @tap="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>
      <view class="field">
        <text>加入方式</text>
        <view class="segment">
          <view :class="{ active: form.joinType === 'public' }" @tap="form.joinType = 'public'">公开加入</view>
          <view :class="{ active: form.joinType === 'review' }" @tap="form.joinType = 'review'">审核加入</view>
        </view>
      </view>
      <label class="field">
        <text>人数上限</text>
        <input v-model.number="form.maxMembers" type="number" placeholder="50" />
      </label>
    </view>

    <button class="primary-action" @tap="submit">创建小队</button>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const tagOptions = ['户外', '徒步', '桌游', '摄影', '城市探索', '运动']
const form = reactive({
  name: '',
  description: '',
  tags: ['户外'],
  joinType: 'review' as 'public' | 'review',
  maxMembers: 50,
})

function toggleTag(tag: string) {
  if (form.tags.includes(tag)) {
    form.tags = form.tags.filter((item) => item !== tag)
    return
  }
  form.tags.push(tag)
}

function submit() {
  if (!form.name.trim() || !form.description.trim()) {
    uni.showToast({ title: '请完善小队信息', icon: 'none' })
    return
  }
  uni.showModal({
    title: '小队已创建',
    content: '当前为 mock 提交流程，后续会写入后端并进入小队详情。',
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

.intro {
  padding: 32rpx;
  margin-bottom: 22rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #12372a, #0f766e);
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
  margin-top: 12rpx;
  font-size: 40rpx;
  font-weight: 900;
  line-height: 1.25;
}

.desc {
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.78);
  font-size: 26rpx;
  line-height: 1.5;
}

.form {
  padding: 28rpx;
  margin-bottom: 26rpx;
  border-radius: 24rpx;
  background: #ffffff;
}

.field {
  display: block;
  margin-bottom: 26rpx;
}

.field text {
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
  height: 170rpx;
  padding: 20rpx 22rpx;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.chip {
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: #f2f4f7;
  color: #667085;
  font-size: 24rpx;
  font-weight: 800;
}

.chip.active {
  background: #dcfce7;
  color: #15803d;
}

.segment {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 8rpx;
  border-radius: 18rpx;
  background: #f2f4f7;
}

.segment view {
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  color: #667085;
  font-size: 25rpx;
  font-weight: 900;
}

.segment .active {
  background: #ffffff;
  color: #15803d;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.08);
}
</style>
