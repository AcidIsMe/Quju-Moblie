<template>
  <view class="page">
    <view class="profile-card">
      <text class="badge">已认证商家</text>
      <text class="name">小桌游局</text>
      <text class="desc">专注轻量桌游、剧本杀和新手友好型线下聚会。</text>
      <tag-list :tags="['桌游', '聚会', '交友']" />
    </view>
    <button class="primary-action" @tap="save">保存资料</button>
  </view>
</template>

<script setup lang="ts">
import TagList from '../../components/tag-list.vue'

function save() {
  uni.showToast({ title: '已保存', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx 28rpx;
  background: #f4f7f5;
}

.profile-card {
  padding: 32rpx;
  margin-bottom: 24rpx;
  border-radius: 22rpx;
  background: #ffffff;
  box-shadow: 0 16rpx 42rpx rgba(15, 23, 42, 0.06);
}

.badge,
.name,
.desc {
  display: block;
}

.badge {
  color: #15803d;
  font-size: 24rpx;
  font-weight: 800;
}

.name {
  margin-top: 12rpx;
  color: #101828;
  font-size: 40rpx;
  font-weight: 900;
}

.desc {
  margin-top: 12rpx;
  color: #667085;
  font-size: 27rpx;
  line-height: 1.5;
}
</style>
