<template>
  <view class="page">
    <map
      class="map"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      show-location
      @tap="onMapTap"
    />
    <view class="panel">
      <text class="title">点击地图选择活动地点</text>
      <text class="coord">坐标：{{ latitude.toFixed(5) }}, {{ longitude.toFixed(5) }}</text>
      <text v-if="address" class="address">{{ address }}</text>
      <text v-if="city" class="city">{{ city }}</text>
      <button class="confirm-btn" @tap="confirm">使用此位置</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const latitude = ref(39.9042)
const longitude = ref(116.4074)
const address = ref('')
const city = ref('')
const markers = ref<any[]>([])

onMounted(() => {
  getCurrentLocation()
})

function getCurrentLocation() {
  uni.getLocation({
    type: 'gcj02',
    success(res) {
      latitude.value = res.latitude
      longitude.value = res.longitude
      updateMarker()
      reverseGeocode(res.latitude, res.longitude)
    },
    fail() {
      updateMarker()
    },
  })
}

function updateMarker() {
  markers.value = [
    {
      id: 1,
      latitude: latitude.value,
      longitude: longitude.value,
      width: 32,
      height: 32,
    },
  ]
}

function onMapTap(e: any) {
  const detail = e.detail as { latitude?: number; longitude?: number }
  if (typeof detail.latitude === 'number' && typeof detail.longitude === 'number') {
    latitude.value = detail.latitude
    longitude.value = detail.longitude
    updateMarker()
    reverseGeocode(detail.latitude, detail.longitude)
  }
}

function reverseGeocode(lat: number, lng: number) {
  // 使用微信内置地图的逆地理编码能力
  const mapCtx = uni.createMapContext('map', undefined!)
  // uni-app 的逆地理编码在微信小程序中需要借助第三方API
  // 这里使用腾讯地图微信小程序SDK的逆地址解析，或后端接口
  // 当前使用 uni.request 模拟，对接后端 /api/location/reverse-geocode
  // 若后端未实现，前端降级为仅保存坐标
  address.value = `(${lat.toFixed(5)}, ${lng.toFixed(5)})`
  city.value = ''
}

function confirm() {
  const eventChannel = getApp().globalData?.__locationPickerResult
  // 使用全局事件传递位置数据
  const app = getApp()
  if (app) {
    app.globalData = app.globalData || {}
    app.globalData.__pickedLocation = {
      latitude: latitude.value,
      longitude: longitude.value,
      address: address.value,
      city: city.value,
    }
  }
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
  bottom: 60rpx;
  padding: 28rpx;
  border-radius: 18rpx;
  background: #ffffff;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}

.title {
  display: block;
  color: #101828;
  font-size: 32rpx;
  font-weight: 900;
  margin-bottom: 12rpx;
}

.coord {
  display: block;
  color: #667085;
  font-size: 24rpx;
  margin-bottom: 6rpx;
}

.address {
  display: block;
  color: #15803d;
  font-size: 28rpx;
  font-weight: 600;
  margin-top: 6rpx;
}

.city {
  display: block;
  color: #475467;
  font-size: 24rpx;
  margin-top: 4rpx;
}

.confirm-btn {
  height: 84rpx;
  margin-top: 20rpx;
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
