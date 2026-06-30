<template>
  <view class="page">
    <!-- 活动摘要 -->
    <view class="activity-summary">
      <text class="as-title">{{ activity.title }}</text>
      <view class="as-info">
        <text class="as-item">{{ activity.start_time }}</text>
        <text class="as-item">{{ activity.location_name }}</text>
        <text class="as-item">{{ formatFee(activity.fee_type, activity.fee_amount) }}</text>
      </view>
    </view>

    <!-- 校验状态 -->
    <view v-if="checks.length" class="checks">
      <view v-for="check in checks" :key="check.key" class="check-row">
        <text class="check-label">{{ check.label }}</text>
        <text v-if="check.pass" class="check-pass">通过</text>
        <text v-else class="check-fail">{{ check.failMsg }}</text>
      </view>
    </view>

    <!-- 安全须知 -->
    <view class="notice-card">
      <text class="notice-title">安全须知</text>
      <text class="notice-text">请确认活动时间与地点，遵守活动安全须知和发起人的指引。活动期间注意人身和财产安全。若无法参加，请在报名截止前及时取消，以便释放名额给其他用户。</text>
    </view>

    <!-- 报名表单 -->
    <view class="form-card">
      <text class="form-title">补充信息（选填）</text>
      <input v-model="phone" class="input" placeholder="手机号" type="number" :maxlength="11" />
      <textarea v-model="remark" class="textarea" placeholder="备注（如：新人第一次参加）" :maxlength="200" />
    </view>

    <!-- 错误提示 -->
    <text v-if="errorMsg" class="error-msg">{{ errorMsg }}</text>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <button
        class="btn-submit"
        :disabled="!canSubmit || submitting"
        @tap="confirm"
      >
        {{ submitting ? '提交中...' : submitBtnText }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { findMockActivity } from '../../services/discover'
import { useAuthStore } from '../../stores/auth'
import type { Activity } from '../../types/domain'
import { formatFee } from '../../utils/format'

const activity = ref<Activity>(findMockActivity())

onLoad((query) => {
  activity.value = findMockActivity(query?.id as string)
})

const auth = useAuthStore()
const phone = ref('')
const remark = ref('')
const submitting = ref(false)
const errorMsg = ref('')

// ---- 校验项 ----
interface CheckItem {
  key: string
  label: string
  pass: boolean
  failMsg: string
}

const checks = computed<CheckItem[]>(() => {
  const user = auth.state.user
  if (!user) return []

  const items: CheckItem[] = []

  // 名额校验
  const hasCapacity = activity.value.current_participants < activity.value.max_participants
  items.push({
    key: 'capacity',
    label: '名额状态',
    pass: hasCapacity,
    failMsg: '名额已满，您可加入等待队列',
  })

  // 信誉校验
  if (activity.value.min_credit_score > 0) {
    const pass = user.credit_score >= activity.value.min_credit_score
    items.push({
      key: 'credit',
      label: `信誉分要求 ≥ ${activity.value.min_credit_score}`,
      pass,
      failMsg: `您的信誉分不满足要求（当前：${user.credit_score}，要求：${activity.value.min_credit_score}）`,
    })
  }

  // 年龄校验
  if (activity.value.min_age > 0) {
    const age = user.birthday ? calcAge(user.birthday) : null
    const pass = age !== null && age >= activity.value.min_age
    items.push({
      key: 'age',
      label: `年龄要求 ≥ ${activity.value.min_age} 岁`,
      pass,
      failMsg: age === null
        ? '请先完善生日信息'
        : `您的年龄不满足要求（当前：${age} 岁，要求：${activity.value.min_age} 岁）`,
    })
  }

  return items
})

const canSubmit = computed(() => checks.value.every(c => c.pass) && activity.value.status === 'published')

const submitBtnText = computed(() => {
  if (!checks.value.length) return '确认报名'
  if (!checks.value.every(c => c.pass)) {
    const fail = checks.value.find(c => !c.pass)
    return fail?.pass === false ? '暂不满足报名条件' : '确认报名'
  }
  return '确认报名'
})

function calcAge(birthday: string): number {
  const birth = new Date(birthday)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

// ---- 提交 ----
function confirm() {
  if (!canSubmit.value) {
    const fail = checks.value.find(c => !c.pass)
    if (fail) {
      errorMsg.value = fail.failMsg
      uni.showToast({ title: fail.failMsg, icon: 'none' })
    }
    return
  }

  submitting.value = true
  errorMsg.value = ''

  // 模拟提交
  setTimeout(() => {
    submitting.value = false
    const a = activity.value
    a.joined = true
    a.current_participants = Math.min(a.max_participants, a.current_participants + 1)

    // 回传状态给详情页
    uni.showModal({
      title: '报名成功',
      content: '你可以在「我的 — 我报名的活动」查看状态。',
      showCancel: false,
      success() {
        // 回退到详情页，detail 页 onShow 会刷新
        uni.navigateBack()
      },
    })
  }, 600)
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  padding-bottom: 160rpx;
  background: #f6f8f7;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.activity-summary {
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.as-title {
  display: block;
  color: #101828;
  font-size: 34rpx;
  font-weight: 900;
  line-height: 1.35;
}

.as-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx 24rpx;
  margin-top: 14rpx;
}

.as-item {
  color: #667085;
  font-size: 24rpx;
}

.checks {
  padding: 22rpx 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.check-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.check-label {
  color: #475467;
  font-size: 26rpx;
}

.check-pass {
  color: #16a34a;
  font-size: 24rpx;
  font-weight: 700;
}

.check-fail {
  color: #dd524d;
  font-size: 24rpx;
}

.notice-card,
.form-card {
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.notice-title,
.form-title {
  display: block;
  color: #101828;
  font-size: 28rpx;
  font-weight: 700;
  margin-bottom: 14rpx;
}

.notice-text {
  display: block;
  color: #667085;
  font-size: 26rpx;
  line-height: 1.6;
}

.input {
  height: 84rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.textarea {
  width: 100%;
  height: 140rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;
  box-sizing: border-box;
}

.error-msg {
  color: #dd524d;
  font-size: 26rpx;
  padding: 0 8rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 28rpx 40rpx;
  background: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.btn-submit {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;

  &[disabled] {
    background: #d1d5db;
    color: #9ca3af;
  }
}
</style>
