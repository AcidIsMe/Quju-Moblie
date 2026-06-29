<template>
  <view class="page">
    <text class="title">确认报名</text>
    <view class="notice">
      <text>请确认时间地点，遵守活动安全须知。若无法参加，请在报名截止前取消。</text>
    </view>
    <input class="input" placeholder="手机号（可选）" />
    <textarea class="textarea" placeholder="备注（可选）" />
    <button class="primary" @tap="confirm">确认报名</button>
  </view>
</template>

<script setup lang="ts">
function confirm() {
  uni.showModal({
    title: '报名成功',
    content: '你可以在「我的-我报名的活动」查看状态。',
    showCancel: false,
    success: () => uni.navigateBack(),
  })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx;
}

.title {
  display: block;
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
  margin-bottom: 24rpx;
}

.notice,
.input,
.textarea {
  border-radius: 14rpx;
  background: #ffffff;
}

.notice {
  padding: 24rpx;
  color: #475467;
  font-size: 28rpx;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.input {
  height: 88rpx;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}

.textarea {
  width: 100%;
  height: 180rpx;
  padding: 24rpx;
}

.primary {
  height: 92rpx;
  margin-top: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
}
</style>
