<template>
  <view class="page">
    <text class="title">商家入驻</text>
    <text class="subtitle">提交营业凭证后，平台审核通过即可发布商家活动。</text>
    <input v-model="form.name" class="input" placeholder="商家名称" />
    <input v-model="form.nickname" class="input" placeholder="商家昵称" />
    <input v-model="form.domains" class="input" placeholder="关注活动领域，用逗号分隔" />
    <button class="upload" @tap="chooseFile">{{ fileName || '上传营业执照或营业凭证' }}</button>
    <button class="primary-action" @tap="submit">提交审核</button>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ name: '', nickname: '', domains: '' })
const fileName = ref('')

function chooseFile() {
  fileName.value = 'license-demo.png'
  uni.showToast({ title: '已选择模拟文件', icon: 'success' })
}

function submit() {
  if (!form.name || !fileName.value) {
    uni.showToast({ title: '请填写商家名称并上传凭证', icon: 'none' })
    return
  }
  uni.showModal({ title: '提交成功', content: '资料已提交，请等待审核。', showCancel: false })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 36rpx 28rpx;
  background: #f4f7f5;
}

.title,
.subtitle {
  display: block;
}

.title {
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
}

.subtitle {
  margin: 10rpx 0 28rpx;
  color: #667085;
  font-size: 26rpx;
  line-height: 1.5;
}

.input,
.upload {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  margin-bottom: 18rpx;
  border-radius: 14rpx;
  background: #ffffff;
  color: #1f2933;
  font-size: 27rpx;
}

.upload {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #15803d;
  font-weight: 700;
}
</style>
