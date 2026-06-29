<template>
  <view class="launch">
    <text class="brand">趣聚</text>
    <text class="slogan">发现同频活动，见到真实的人</text>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { routes } from '../../utils/routes'
import { useAuthStore } from '../../stores/auth'

onMounted(() => {
  const auth = useAuthStore()
  auth.restore()
  setTimeout(() => {
    if (auth.state.token) {
      uni.switchTab({ url: routes.home })
    } else {
      uni.redirectTo({ url: routes.login })
    }
  }, 500)
})
</script>

<style scoped lang="scss">
.launch {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  background: #16a34a;
}

.brand {
  color: #ffffff;
  font-size: 72rpx;
  font-weight: 900;
}

.slogan {
  color: rgba(255, 255, 255, 0.84);
  font-size: 28rpx;
}
</style>
