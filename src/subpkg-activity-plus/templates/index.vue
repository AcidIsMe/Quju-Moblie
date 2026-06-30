<template>
  <view class="page">
    <view class="header">
      <text class="title">活动模板</text>
      <text class="subtitle">选择一个常用场景，快速生成草稿。</text>
    </view>

    <view class="category-row">
      <button
        v-for="item in categories"
        :key="item"
        :class="{ active: currentCategory === item }"
        @tap="currentCategory = item"
      >
        {{ item }}
      </button>
    </view>

    <view class="template-list">
      <view v-for="template in filteredTemplates" :key="template.id" class="template-card">
        <view>
          <text class="template-name">{{ template.name }}</text>
          <text class="template-desc">{{ template.description }}</text>
        </view>
        <tag-list :tags="template.tags" />
        <view class="template-meta">
          <text>{{ template.preset_duration_minutes }} 分钟</text>
          <text>{{ template.preset_max_participants }} 人上限</text>
        </view>
        <button class="primary-action" @tap="useTemplate(template.name)">使用模板</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TagList from '../../components/tag-list.vue'
import { mockTemplates } from '../../mocks/activities'

const categories = ['全部', '户外徒步', '桌游聚会', '城市探索']
const currentCategory = ref('全部')

const filteredTemplates = computed(() => {
  if (currentCategory.value === '全部') return mockTemplates
  return mockTemplates.filter((item) => item.category === currentCategory.value)
})

function useTemplate(name: string) {
  uni.showToast({ title: `已基于「${name}」生成草稿`, icon: 'none' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx 28rpx;
  background: #f4f7f5;
}

.header {
  margin-bottom: 24rpx;
}

.title,
.subtitle,
.template-name,
.template-desc {
  display: block;
}

.title {
  color: #101828;
  font-size: 42rpx;
  font-weight: 900;
}

.subtitle {
  margin-top: 8rpx;
  color: #667085;
  font-size: 26rpx;
}

.category-row {
  display: flex;
  gap: 14rpx;
  margin-bottom: 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.category-row button {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #475467;
  font-size: 25rpx;
}

.category-row .active {
  background: linear-gradient(135deg, #16a34a, #0f9f8c);
  color: #ffffff;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.template-card {
  padding: 28rpx;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 16rpx 42rpx rgba(15, 23, 42, 0.06);
}

.template-name {
  color: #101828;
  font-size: 32rpx;
  font-weight: 900;
}

.template-desc {
  margin-top: 10rpx;
  color: #667085;
  font-size: 26rpx;
  line-height: 1.5;
}

.template-meta {
  display: flex;
  gap: 18rpx;
  margin: 18rpx 0;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 700;
}
</style>
