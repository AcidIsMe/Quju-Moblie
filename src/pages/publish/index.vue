<template>
  <view class="page">
    <view class="hero">
      <view>
        <text class="eyebrow">CREATE EVENT</text>
        <text class="title">发起一次线下活动</text>
        <text class="subtitle">从手动创建、模板复用到草稿续写，先把一次真实聚会组织起来。</text>
      </view>
      <view class="hero-icon">
        <uni-icons type="compose" size="28" color="#ffffff" />
      </view>
    </view>

    <view class="actions">
      <view class="action-card primary" @tap="navigateTo(routes.activityCreate)">
        <view class="icon">
          <uni-icons type="plus-filled" size="26" color="#ffffff" />
        </view>
        <view class="body">
          <text class="action-title">手动创建活动</text>
          <text class="action-desc">填写活动信息、时间地点、报名规则</text>
        </view>
        <uni-icons type="right" size="16" color="#ffffff" />
      </view>
      <view class="action-card" @tap="navigateTo(routes.templates)">
        <view class="icon">
          <uni-icons type="list" size="25" color="#15803d" />
        </view>
        <view class="body">
          <text class="action-title">活动模板</text>
          <text class="action-desc">徒步、桌游、摄影等常见活动快速套用</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
      <view class="action-card" @tap="navigateTo(routes.drafts)">
        <view class="icon">
          <uni-icons type="folder-add-filled" size="25" color="#0f766e" />
        </view>
        <view class="body">
          <text class="action-title">草稿箱</text>
          <text class="action-desc">继续编辑未发布的活动</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
      <view class="action-card" @tap="navigateTo(routes.summaryEdit)">
        <view class="icon">
          <uni-icons type="images-filled" size="25" color="#2563eb" />
        </view>
        <view class="body">
          <text class="action-title">活动总结</text>
          <text class="action-desc">上传照片并沉淀活动回顾</text>
        </view>
        <uni-icons type="right" size="16" color="#98a2b3" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { navigateTo, routes } from '../../utils/routes'
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 30rpx 28rpx;
  background: #f4f7f5;
}

.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  padding: 34rpx;
  border-radius: 28rpx;
  background:
    radial-gradient(circle at 100% 0%, rgba(45, 212, 191, 0.2), transparent 35%),
    linear-gradient(135deg, #12372a, #0f766e);
  color: #ffffff;
  box-shadow: 0 18rpx 48rpx rgba(15, 118, 110, 0.18);
}

.hero-icon {
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.16);
}

.eyebrow {
  display: block;
  color: #bbf7d0;
  font-size: 22rpx;
  font-weight: 900;
}

.title {
  display: block;
  margin-top: 12rpx;
  color: #ffffff;
  font-size: 42rpx;
  font-weight: 900;
  line-height: 1.25;
}

.subtitle {
  display: block;
  margin-top: 14rpx;
  color: rgba(255, 255, 255, 0.78);
  font-size: 26rpx;
  line-height: 1.5;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 26rpx;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-height: 112rpx;
  padding: 24rpx;
  border-radius: 22rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 34rpx rgba(15, 23, 42, 0.05);
}

.action-card.primary {
  background: linear-gradient(135deg, #16a34a, #0f9f8c);
  color: #ffffff;
}

.icon {
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 22rpx;
  background: #ecfdf3;
}

.primary .icon {
  background: rgba(255, 255, 255, 0.2);
}

.body {
  flex: 1;
  min-width: 0;
}

.action-title,
.action-desc {
  display: block;
}

.action-title {
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.primary .action-title {
  color: #ffffff;
}

.action-desc {
  margin-top: 8rpx;
  color: #667085;
  font-size: 24rpx;
  line-height: 1.35;
}

.primary .action-desc {
  color: rgba(255, 255, 255, 0.78);
}
</style>
