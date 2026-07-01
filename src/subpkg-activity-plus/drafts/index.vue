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
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ActivityCard from '../../components/activity-card.vue'
import EmptyState from '../../components/empty-state.vue'
import { deleteActivity } from '../../services/activity'
import { getMyCreatedActivities } from '../../services/user'

const DRAFT_KEY = 'activity_drafts'

interface DraftItem {
  id: string
  title: string
  [key: string]: any
}

const drafts = ref<DraftItem[]>([])

function loadLocalDrafts(): DraftItem[] {
  try {
    return uni.getStorageSync(DRAFT_KEY) || []
  } catch {
    return []
  }
}

async function loadDrafts() {
  // 本地草稿（手动保存 + 模板创建后写入的）
  const localMap = new Map<string, DraftItem>()
  for (const d of loadLocalDrafts()) {
    localMap.set(d.id, d)
  }

  // 服务端草稿（兜底：万一模板页没写入 localStorage）
  try {
    const result = await getMyCreatedActivities()
    const all = (result.data as any[]) || []
    for (const d of all) {
      if (d.status === 'draft') {
        // 本地已有的优先（可能包含用户手动编辑的最新数据）
        if (!localMap.has(d.id)) {
          localMap.set(d.id, d)
        }
      }
    }
  } catch { /* ignore */ }

  drafts.value = Array.from(localMap.values())
}

function continueEdit(draft: DraftItem) {
  uni.setStorageSync('editing_draft', draft)
  uni.navigateTo({ url: '/subpkg-activity/create/index' })
}

async function removeDraft(id: string) {
  try { await deleteActivity(id) } catch { /* ignore */ }
  drafts.value = drafts.value.filter((item) => item.id !== id)
  const local: DraftItem[] = loadLocalDrafts()
  uni.setStorageSync(DRAFT_KEY, local.filter((item) => item.id !== id))
}

onMounted(() => {
  loadDrafts()
})

onShow(() => {
  // 每次回到页面时刷新本地草稿（响应模板页写入的最新数据）
  const local = loadLocalDrafts()
  const localIds = new Set(local.map((d) => d.id))
  // 合并：本地覆盖已有 + 新增本地独有
  const merged = new Map<string, DraftItem>()
  for (const d of drafts.value) {
    if (!localIds.has(d.id)) merged.set(d.id, d)
  }
  for (const d of local) {
    merged.set(d.id, d)
  }
  drafts.value = Array.from(merged.values())
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
