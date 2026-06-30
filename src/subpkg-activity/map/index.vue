<template>
  <view class="page">
    <!-- 地图 -->
    <map
      id="discoverMap"
      class="map"
      :latitude="centerLat"
      :longitude="centerLng"
      :markers="markers"
      :scale="scale"
      show-location
      @markertap="onMarkerTap"
      @regionchange="onRegionChange"
    />

    <!-- 定位按钮 -->
    <button class="locate-btn" @tap="moveToCurrent">
      <text>📍</text>
    </button>

    <!-- 位置未授权提示 -->
    <view v-if="!locationAuthorized" class="permission-bar" @tap="requestLocation">
      <text>需要位置权限，点击开启</text>
    </view>

    <!-- 活动摘要卡片 -->
    <view v-if="selected" class="summary-card" @tap="openDetail">
      <view class="card-top">
        <text class="card-title">{{ selected.title }}</text>
        <view class="card-type">{{ selected.activity_type }}</view>
      </view>
      <text class="card-location">{{ selected.location_name }}</text>
      <view class="card-meta">
        <text>{{ selected.current_participants }}/{{ selected.max_participants }} 人</text>
        <text>{{ selected.start_time }}</text>
        <text v-if="selected.distance_text">{{ selected.distance_text }}</text>
      </view>
      <text class="card-action">点击查看详情 ></text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { mockActivities } from '../../mocks/activities'
import { useLocationStore } from '../../stores/location'
import { navigateTo, routes } from '../../utils/routes'
import type { Activity } from '../../types/domain'

const locationStore = useLocationStore()

const centerLat = ref(39.9042)
const centerLng = ref(116.4074)
const scale = ref(12)
const locationAuthorized = ref(false)
const selected = ref<Activity | null>(null)
const loaded = ref(false)

// markers 计算
const markers = computed(() =>
  mockActivities.map((item, index) => ({
    id: index,
    latitude: item.location_lat,
    longitude: item.location_lng,
    iconPath: '/static/map-marker.png',
    width: 30,
    height: 30,
    title: item.title,
    callout: {
      content: item.title,
      color: '#101828',
      fontSize: 13,
      borderRadius: 8,
      padding: 8,
      display: 'BYCLICK',
      bgColor: '#ffffff',
    },
  })),
)

// ---- 初始化 ----
onMounted(() => {
  initLocation()
})

function initLocation() {
  uni.getLocation({
    type: 'gcj02',
    success(res) {
      locationAuthorized.value = true
      centerLat.value = res.latitude
      centerLng.value = res.longitude
      locationStore.state.authorized = true
      locationStore.state.latitude = res.latitude
      locationStore.state.longitude = res.longitude
      if (!loaded.value) {
        loaded.value = true
        fitAllMarkers()
      }
    },
    fail() {
      locationAuthorized.value = false
      fitAllMarkers()
    },
  })
}

function requestLocation() {
  uni.openSetting({
    success() {
      initLocation()
    },
  })
}

function moveToCurrent() {
  if (locationAuthorized.value) {
    centerLat.value = locationStore.state.latitude
    centerLng.value = locationStore.state.longitude
    scale.value = 14
  } else {
    requestLocation()
  }
}

// ---- 自动缩放适配所有点位 ----
function fitAllMarkers() {
  const points = mockActivities.map(item => ({
    latitude: item.location_lat,
    longitude: item.location_lng,
  }))

  const mapCtx = uni.createMapContext('discoverMap')
  if (points.length > 0) {
    mapCtx.includePoints({
      points,
      padding: [60, 40, 60, 40],
    })
  }
}

// ---- Marker 点击 ----
function onMarkerTap(event: { detail: { markerId: number } }) {
  selected.value = mockActivities[event.detail.markerId] || null
}

// ---- 视野变化 ----
let regionTimer: ReturnType<typeof setTimeout> | null = null
function onRegionChange(_e: any) {
  // 视野变化后可以按新范围重新请求点位
  // 当前使用 Mock 数据，暂不重新请求
  // 对接真实 API 后调用 GET /api/discover/map?sw_lat=&sw_lng=&ne_lat=&ne_lng=
  if (regionTimer) clearTimeout(regionTimer)
  regionTimer = setTimeout(() => {
    // 预留：按视野范围重新加载 markers
  }, 500)
}

// ---- 跳转详情 ----
function openDetail() {
  if (selected.value) {
    navigateTo(`${routes.activityDetail}?id=${selected.value.id}`)
  }
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}

.locate-btn {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  font-size: 32rpx;
}

.permission-bar {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  right: 110rpx;
  padding: 18rpx 24rpx;
  border-radius: 14rpx;
  background: #fff7ed;
  color: #c2410c;
  font-size: 26rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.summary-card {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  bottom: 60rpx;
  padding: 26rpx 28rpx;
  border-radius: 18rpx;
  background: #ffffff;
  box-shadow: 0 6rpx 28rpx rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.card-title {
  flex: 1;
  color: #101828;
  font-size: 32rpx;
  font-weight: 900;
  line-height: 1.3;
}

.card-type {
  flex-shrink: 0;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 22rpx;
  font-weight: 600;
}

.card-location {
  color: #475467;
  font-size: 26rpx;
}

.card-meta {
  display: flex;
  gap: 20rpx;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 600;
}

.card-action {
  text-align: right;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 700;
  margin-top: 4rpx;
}
</style>
