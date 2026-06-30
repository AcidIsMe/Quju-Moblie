<template>
  <view class="page">
    <view class="top">
      <input v-model="keyword" class="search" placeholder="搜索小队名称或标签" />
      <button @tap="navigateTo(routes.teamCreate)">创建</button>
    </view>
    <view v-for="team in filteredTeams" :key="team.id" class="team-card" @tap="navigateTo(`${routes.teamDetail}?id=${team.id}`)">
      <text class="name">{{ team.name }}</text>
      <text class="desc">{{ team.description }}</text>
      <tag-list :tags="team.interest_tags" />
      <view class="meta">
        <text>{{ team.current_members }}/{{ team.max_members }} 人</text>
        <text>{{ team.join_type === 'public' ? '公开加入' : '审核加入' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import TagList from '../../components/tag-list.vue'
import { getTeams } from '../../services/team'
import { navigateTo, routes } from '../../utils/routes'
import type { Team } from '../../types/domain'

const keyword = ref('')
const teams = ref<Team[]>([])

onMounted(async () => {
  try {
    const result = await getTeams()
    teams.value = result.data
  } catch { /* silent */ }
})

const filteredTeams = computed(() => {
  if (!keyword.value.trim()) return teams.value
  return teams.value.filter(
    (team) =>
      team.name.includes(keyword.value) ||
      team.interest_tags.some((tag) => tag.includes(keyword.value)),
  )
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f4f7f5;
}

.top {
  display: flex;
  gap: 16rpx;
  margin-bottom: 22rpx;
}

.top button {
  width: 128rpx;
  height: 88rpx;
  border-radius: 18rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 900;
}

.search {
  flex: 1;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 16rpx;
  background: #ffffff;
  font-size: 27rpx;
}

.team-card {
  padding: 28rpx;
  margin-bottom: 18rpx;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 14rpx 38rpx rgba(15, 23, 42, 0.05);
}

.name,
.desc {
  display: block;
}

.name {
  color: #101828;
  font-size: 32rpx;
  font-weight: 900;
}

.desc {
  margin-top: 10rpx;
  color: #667085;
  font-size: 26rpx;
  line-height: 1.5;
}

.meta {
  display: flex;
  gap: 18rpx;
  margin-top: 16rpx;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
