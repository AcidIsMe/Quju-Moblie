import { reactive } from 'vue'

const state = reactive({
  authorized: false,
  latitude: 39.9042,
  longitude: 116.4074,
  city: '北京',
})

export function useLocationStore() {
  function requestLocation() {
    uni.getLocation({
      type: 'gcj02',
      success(result) {
        state.authorized = true
        state.latitude = result.latitude
        state.longitude = result.longitude
      },
      fail() {
        state.authorized = false
        uni.showToast({ title: '需要位置权限才能查看附近活动', icon: 'none' })
      },
    })
  }

  return {
    state,
    requestLocation,
  }
}
