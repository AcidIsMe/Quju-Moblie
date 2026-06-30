<template>
  <view class="page">
    <view class="scan-card">
      <text class="icon">QR</text>
      <text class="title">扫码签到</text>
      <text class="subtitle">到达活动现场后，扫描发起人提供的签到码。</text>
      <button class="primary-action" @tap="scan">开始扫码</button>
    </view>
  </view>
</template>

<script setup lang="ts">
function scan() {
  uni.showToast({ title: '模拟签到成功', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 48rpx 32rpx;
  background: #f4f7f5;
}

.scan-card {
  padding: 48rpx 32rpx;
  border-radius: 24rpx;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 18rpx 48rpx rgba(15, 23, 42, 0.07);
}

.icon {
  width: 128rpx;
  height: 128rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24rpx;
  border-radius: 24rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 38rpx;
  font-weight: 900;
}

.title,
.subtitle {
  display: block;
}

.title {
  color: #101828;
  font-size: 40rpx;
  font-weight: 900;
}

.subtitle {
  margin: 14rpx 0 34rpx;
  color: #667085;
  font-size: 27rpx;
}
</style>
