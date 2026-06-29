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
  background: #f6f8f7;
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
</style>
