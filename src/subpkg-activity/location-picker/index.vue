<template>
  <view class="page">
    <map class="map" :latitude="latitude" :longitude="longitude" @tap="pick" />
    <view class="panel">
      <text class="title">地图选点</text>
      <text>当前坐标：{{ latitude.toFixed(5) }}, {{ longitude.toFixed(5) }}</text>
      <button @tap="confirm">使用此位置</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const latitude = ref(39.9042)
const longitude = ref(116.4074)

const pick = (event: any) => {
  const detail = event.detail as { latitude?: number; longitude?: number }
  if (typeof detail.latitude === 'number' && typeof detail.longitude === 'number') {
    latitude.value = detail.latitude
    longitude.value = detail.longitude
  }
}

function confirm() {
  uni.showToast({ title: '位置已选择', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 400)
}
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  bottom: 40rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #ffffff;
  color: #475467;
  font-size: 26rpx;
}

.title {
  display: block;
  color: #101828;
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 10rpx;
}

button {
  height: 84rpx;
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
}
</style>
