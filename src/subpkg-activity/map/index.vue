<template>
  <view class="page">
    <map class="map" :latitude="location.state.latitude" :longitude="location.state.longitude" :markers="markers" @markertap="onMarkerTap" />
    <view v-if="selected" class="summary" @tap="navigateTo(`${routes.activityDetail}?id=${selected.id}`)">
      <text class="title">{{ selected.title }}</text>
      <text>{{ selected.location_name }}</text>
      <text>{{ selected.current_participants }}/{{ selected.max_participants }} 人</text>
    </view>
    <button class="locate" @tap="location.requestLocation">定位</button>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { mockActivities } from '../../mocks/activities'
import type { Activity } from '../../types/domain'
import { useLocationStore } from '../../stores/location'
import { navigateTo, routes } from '../../utils/routes'

const location = useLocationStore()
const selected = ref<Activity | null>(mockActivities[0])

const markers = computed(() =>
  mockActivities.map((item, index) => ({
    id: index,
    latitude: item.location_lat,
    longitude: item.location_lng,
    iconPath: '/static/map-marker.png',
    width: 28,
    height: 28,
    title: item.title,
  })),
)

function onMarkerTap(event: { detail: { markerId: number } }) {
  selected.value = mockActivities[event.detail.markerId]
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

.summary {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  bottom: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #ffffff;
  color: #475467;
  font-size: 24rpx;
}

.title {
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.locate {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #15803d;
  font-size: 26rpx;
}
</style>
