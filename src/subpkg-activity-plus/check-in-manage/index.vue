<template>
  <view class="page">
    <view class="stats">
      <view>
        <text class="num">25</text>
        <text class="label">已签到</text>
      </view>
      <view>
        <text class="num">30</text>
        <text class="label">报名人数</text>
      </view>
      <view>
        <text class="num">83%</text>
        <text class="label">签到率</text>
      </view>
    </view>

    <button class="primary-action" @tap="generate">生成签到二维码</button>

    <view class="list">
      <view v-for="item in users" :key="item.name" class="row">
        <text>{{ item.name }}</text>
        <text :class="{ checked: item.checked }">{{ item.checked ? '已签到' : '未签到' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const users = [
  { name: '李四', checked: true },
  { name: '王五', checked: false },
  { name: '赵六', checked: true },
]

function generate() {
  uni.showModal({ title: '签到二维码', content: '模拟二维码已生成，有效期至活动结束。', showCancel: false })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx 28rpx;
  background: #f4f7f5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.stats view {
  padding: 24rpx 12rpx;
  border-radius: 18rpx;
  background: #ffffff;
  text-align: center;
}

.num,
.label {
  display: block;
}

.num {
  color: #15803d;
  font-size: 36rpx;
  font-weight: 900;
}

.label {
  margin-top: 8rpx;
  color: #667085;
  font-size: 23rpx;
}

.list {
  margin-top: 24rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx;
  margin-bottom: 12rpx;
  border-radius: 14rpx;
  background: #ffffff;
  color: #475467;
  font-size: 27rpx;
}

.checked {
  color: #15803d;
  font-weight: 800;
}
</style>
