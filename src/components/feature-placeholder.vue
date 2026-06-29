<template>
  <view class="placeholder">
    <text class="title">{{ title }}</text>
    <text class="description">{{ description }}</text>
    <button v-if="back" @tap="goBack">返回</button>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    back?: boolean
  }>(),
  {
    description: '页面路由和入口已预留，后续按迭代计划接入接口与交互。',
    back: true,
  },
)

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.placeholder {
  min-height: 100vh;
  padding: 80rpx 36rpx;
}

.title {
  display: block;
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
}

.description {
  display: block;
  margin-top: 18rpx;
  color: #667085;
  font-size: 28rpx;
  line-height: 1.5;
}

button {
  height: 88rpx;
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 800;
}
</style>
