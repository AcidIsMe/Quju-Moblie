<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useAuthStore } from './stores/auth'

onLaunch(() => {
  useAuthStore().restore()
})
</script>

<style lang="scss">
page {
  min-height: 100%;
  background: #f4f7f5;
  color: #1f2933;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1.4;

  &::after {
    border: 0;
  }
}

.surface {
  border: 1rpx solid rgba(22, 163, 74, 0.08);
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.06);
}

.primary-action {
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #16a34a 0%, #0f9f8c 100%);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
  box-shadow: 0 14rpx 30rpx rgba(22, 163, 74, 0.22);
}
</style>
