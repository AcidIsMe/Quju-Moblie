<template>
  <view class="page">
    <view class="header">
      <text class="title">草稿箱</text>
      <text class="subtitle">保存未完成的活动，稍后继续编辑。</text>
    </view>

    <view v-for="draft in drafts" :key="draft.id" class="draft-card">
      <activity-card :activity="draft" />
      <view class="actions">
        <button @tap="continueEdit(draft)">继续编辑</button>
        <button class="danger" @tap="removeDraft(draft.id)">删除</button>
      </view>
    </view>

    <empty-state v-if="drafts.length === 0" title="暂无草稿" description="创建活动时可以随时保存草稿。" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ActivityCard from '../../components/activity-card.vue'
import EmptyState from '../../components/empty-state.vue'

const DRAFT_KEY = 'activity_drafts'

interface DraftItem {
  id: string
  title: string
  [key: string]: any
}

const drafts = ref<DraftItem[]>([])

function loadDrafts() {
  try {
    drafts.value = uni.getStorageSync(DRAFT_KEY) || []
  } catch {
    drafts.value = []
  }
}

function continueEdit(draft: DraftItem) {
  // 将选中草稿存入临时 key，创建页读取并预填
  uni.setStorageSync('editing_draft', draft)
  uni.navigateTo({ url: '/subpkg-activity/create/index' })
}

function removeDraft(id: string) {
  drafts.value = drafts.value.filter((item) => item.id !== id)
  uni.setStorageSync(DRAFT_KEY, drafts.value)
}

onShow(() => {
  loadDrafts()
})
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
.subtitle {
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

.draft-card {
  margin-bottom: 24rpx;
}

.actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.actions button {
  flex: 1;
  height: 80rpx;
  border-radius: 14rpx;
  background: #ffffff;
  color: #15803d;
  font-size: 27rpx;
  font-weight: 700;
}

.actions .danger {
  color: #c2410c;
}
</style>
