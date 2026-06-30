<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-row">
      <input
        v-model="keyword"
        class="input"
        placeholder="搜索活动名称或标签"
        confirm-type="search"
        @confirm="search"
        @input="onInput"
      />
      <button class="search-btn" @tap="search">搜索</button>
    </view>

    <!-- 快捷入口 -->
    <view class="tools">
      <button @tap="navigateTo(routes.activityMap)">地图模式</button>
      <button @tap="showFilter">筛选</button>
    </view>

    <!-- 热门推荐（无搜索词时） -->
    <view v-if="!searched" class="hot-section">
      <text class="section-title">热门推荐</text>
      <view class="hot-tags">
        <text
          v-for="tag in hotTags"
          :key="tag"
          class="hot-tag"
          @tap="quickSearch(tag)"
        >{{ tag }}</text>
      </view>
      <view class="list">
        <activity-card v-for="activity in hotActivities" :key="activity.id" :activity="activity" />
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-else>
      <!-- 加载中 -->
      <view v-if="searching" class="loading-state">
        <text>搜索中...</text>
      </view>

      <!-- 空结果 -->
      <empty-state
        v-else-if="results.length === 0"
        title="未找到相关活动"
        description="试试其他关键词，或查看下面的热门活动"
      />

      <!-- 结果列表 -->
      <view v-else class="list">
        <activity-card v-for="activity in results" :key="activity.id" :activity="activity" />

        <!-- 底部加载更多 -->
        <view v-if="loadingMore" class="load-more">
          <text>加载中...</text>
        </view>
        <view v-else-if="!hasMore && results.length > PAGE_SIZE" class="load-more">
          <text>— 已展示全部结果 —</text>
        </view>
      </view>

      <!-- 无结果时展示热门推荐 -->
      <view v-if="!searching && results.length === 0" class="hot-section">
        <text class="section-title">热门活动推荐</text>
        <view class="list">
          <activity-card v-for="activity in hotActivities" :key="activity.id" :activity="activity" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import ActivityCard from '../../components/activity-card.vue'
import EmptyState from '../../components/empty-state.vue'
import { searchActivities, getActivities } from '../../services/discover'
import type { Activity } from '../../types/domain'
import { navigateTo, routes } from '../../utils/routes'

const PAGE_SIZE = 20

const hotTags = ['徒步', '桌游', '摄影', '户外', '运动', '周末', '公益', '聚餐']

const keyword = ref('')
const searched = ref(false)
const searching = ref(false)
const results = ref<Activity[]>([])
const loadingMore = ref(false)
const hasMore = ref(true)

const hotActivities = ref<Activity[]>([])

onLoad(async () => {
  try {
    const res = await getActivities('recommended', { limit: 6 })
    hotActivities.value = res.data
  } catch {
    // 静默处理
  }
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (keyword.value.trim()) {
      doSearch()
    }
  }, 400)
}

function search() {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!keyword.value.trim()) {
    uni.showToast({ title: '请输入关键词', icon: 'none' })
    return
  }
  doSearch()
}

function quickSearch(tag: string) {
  keyword.value = tag
  doSearch()
}

async function doSearch(reset = true) {
  const q = keyword.value.trim()
  if (!q) return

  if (reset) {
    searching.value = true
    results.value = []
    hasMore.value = true
  } else {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
  }

  searched.value = true

  try {
    const res = await searchActivities(q, {
      cursor: reset ? undefined : String(results.value.length),
      limit: PAGE_SIZE,
    })
    if (reset) {
      results.value = res.data
    } else {
      results.value = [...results.value, ...res.data]
    }
    hasMore.value = res.pagination?.has_more ?? false
  } catch (e: any) {
    uni.showToast({ title: e.message || '搜索失败', icon: 'none' })
  } finally {
    searching.value = false
    loadingMore.value = false
  }
}

function showFilter() {
  uni.showToast({ title: '高级筛选将在 P1 迭代接入', icon: 'none' })
}

// 触底加载更多
onReachBottom(() => {
  if (searched.value) {
    doSearch(false)
  }
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f6f8f7;
}

.search-row,
.tools {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.input {
  flex: 1;
  height: 84rpx;
  padding: 0 24rpx;
  border-radius: 14rpx;
  background: #ffffff;
  font-size: 28rpx;
  color: #101828;
}

.search-btn {
  padding: 0 28rpx;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
}

.tools button {
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #15803d;
  font-size: 26rpx;
}

.hot-section {
  margin-top: 16rpx;
}

.section-title {
  display: block;
  color: #101828;
  font-size: 30rpx;
  font-weight: 800;
  margin-bottom: 16rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-bottom: 28rpx;
}

.hot-tag {
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 26rpx;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.loading-state {
  padding: 120rpx 40rpx;
  display: flex;
  justify-content: center;
  color: #667085;
  font-size: 28rpx;
}

.load-more {
  padding: 28rpx 0;
  display: flex;
  justify-content: center;
  color: #9ca3af;
  font-size: 24rpx;
}
</style>
