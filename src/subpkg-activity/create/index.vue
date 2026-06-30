<template>
  <view class="page">
    <view class="section">
      <text class="section-title">基础信息</text>

      <!-- 活动名称 -->
      <input v-model="form.title" class="input" placeholder="活动名称" :maxlength="100" />

      <!-- 活动类型 -->
      <picker :range="activityTypes" @change="onTypeChange">
        <view class="picker-field">
          <text :class="{ placeholder: !form.activityType }">{{ form.activityType || '选择活动类型' }}</text>
        </view>
      </picker>

      <!-- 封面图 -->
      <view class="cover-row" @tap="pickCover">
        <image v-if="form.coverImageUrl" :src="form.coverImageUrl" class="cover-img" mode="aspectFill" />
        <view v-else class="cover-placeholder">
          <text>+ 上传封面图</text>
        </view>
      </view>

      <!-- 标签 -->
      <view class="tag-row">
        <view v-for="(tag, idx) in form.tags" :key="idx" class="tag">
          <text>{{ tag }}</text>
          <text class="tag-close" @tap="removeTag(idx)">x</text>
        </view>
        <view v-if="form.tags.length < 5" class="tag tag-add" @tap="showTagInput = true">
          <text>+ 添加标签</text>
        </view>
      </view>
      <view v-if="showTagInput" class="tag-input-row">
        <input v-model="tagInput" class="tag-input" placeholder="输入标签，回车确认" :maxlength="10" @confirm="addTag" />
        <button class="tag-confirm" @tap="addTag">确认</button>
      </view>

      <!-- 简介 -->
      <textarea v-model="form.description" class="textarea" placeholder="活动简介（必填）" :maxlength="500" />
      <text class="counter">{{ form.description.length }}/500</text>
    </view>

    <view class="section">
      <text class="section-title">时间地点</text>

      <!-- 开始时间 -->
      <picker mode="multiSelector" :range="startPicker.ranges" :value="startPicker.indices" @change="startPicker.onChange" @columnchange="startPicker.onColumnChange">
        <view class="picker-field">
          <text :class="{ placeholder: !startPicker.text.value }">{{ startPicker.text.value || '选择开始时间' }}</text>
        </view>
      </picker>

      <!-- 结束时间 -->
      <picker mode="multiSelector" :range="endPicker.ranges" :value="endPicker.indices" @change="endPicker.onChange" @columnchange="endPicker.onColumnChange">
        <view class="picker-field">
          <text :class="{ placeholder: !endPicker.text.value }">{{ endPicker.text.value || '选择结束时间' }}</text>
        </view>
      </picker>

      <!-- 报名截止时间 -->
      <picker mode="multiSelector" :range="deadlinePicker.ranges" :value="deadlinePicker.indices" @change="deadlinePicker.onChange" @columnchange="deadlinePicker.onColumnChange">
        <view class="picker-field">
          <text :class="{ placeholder: !deadlinePicker.text.value }">{{ deadlinePicker.text.value || '选择报名截止时间' }}</text>
        </view>
      </picker>

      <!-- 城市 -->
      <input v-model="form.city" class="input" placeholder="活动城市（如：北京）" :maxlength="50" />

      <!-- 地图选点 -->
      <view class="location-row" @tap="pickLocation">
        <view class="location-main">
          <uni-icons type="location-filled" size="20" color="#16a34a" />
          <text v-if="form.locationName" class="location-text">{{ form.locationName }}（已选点）</text>
          <text v-else class="location-placeholder">点击进行地图选点</text>
        </view>
        <uni-icons type="right" size="16" color="#9ca3af" />
      </view>
    </view>

    <view class="section">
      <text class="section-title">参与设置</text>

      <!-- 人数上限 -->
      <view class="input-row">
        <text class="input-label">人数上限</text>
        <input v-model="form.maxParticipants" class="input num" type="number" placeholder="0" />
      </view>

      <!-- 费用类型 -->
      <view class="switch-row">
        <text class="input-label">费用</text>
        <view class="switch-group">
          <view class="switch-item" :class="{ active: form.feeType === 'free' }" @tap="form.feeType = 'free'">
            <text>免费</text>
          </view>
          <view class="switch-item" :class="{ active: form.feeType === 'paid' }" @tap="form.feeType = 'paid'">
            <text>收费</text>
          </view>
        </view>
      </view>

      <!-- 费用金额（收费时展示） -->
      <view v-if="form.feeType === 'paid'" class="input-row">
        <text class="input-label">金额 (元)</text>
        <input v-model="form.feeAmount" class="input num" type="digit" placeholder="0.00" />
      </view>

      <!-- 最低信誉分 -->
      <view class="input-row">
        <text class="input-label">最低信誉分</text>
        <input v-model="form.minCreditScore" class="input num" type="number" placeholder="0（不限制）" />
      </view>

      <!-- 最低年龄 -->
      <view class="input-row">
        <text class="input-label">最低年龄</text>
        <input v-model="form.minAge" class="input num" type="number" placeholder="0（不限制）" />
      </view>
    </view>

    <!-- 错误提示 -->
    <text v-if="errors" class="error-msg">{{ errors }}</text>

    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <button class="btn-draft" @tap="saveDraft">保存草稿</button>
      <button class="btn-submit" :disabled="submitting" @tap="submit">
        {{ submitting ? '提交中...' : '提交审核' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import { navigateTo, routes } from '../../utils/routes'
import { request } from '../../services/http'

const activityTypes = ['运动健身', '户外徒步', '桌游聚会', '学习交流', '公益活动', '城市探索', '聚餐美食', '观影娱乐', '其他']

const form = reactive({
  title: '',
  activityType: '',
  coverImageUrl: '',
  tags: [] as string[],
  description: '',
  city: '',
  locationName: '',
  locationLat: 0,
  locationLng: 0,
  maxParticipants: '',
  feeType: 'free' as 'free' | 'paid',
  feeAmount: '',
  minCreditScore: '',
  minAge: '',
})

const tagInput = ref('')
const showTagInput = ref(false)
const errors = ref('')
const submitting = ref(false)

// ---- 时间选择器 ----
const now = new Date()
const YEAR_LIST: number[] = []
for (let y = now.getFullYear(); y <= now.getFullYear() + 1; y++) YEAR_LIST.push(y)
const MONTH_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const HOUR_LIST: number[] = []
for (let h = 0; h <= 23; h++) HOUR_LIST.push(h)
const MINUTE_LIST = [0, 30]

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function makeDayList(yearIdx: number, monthIdx: number) {
  const max = daysInMonth(YEAR_LIST[yearIdx], MONTH_LIST[monthIdx])
  const list: number[] = []
  for (let d = 1; d <= max; d++) list.push(d)
  return list
}

function formatTime(y: number, m: number, d: number, h: number, min: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`
}

// ---- 创建单个时间选择器 ----
function createTimePicker() {
  const initYearIdx = 0
  const initMonthIdx = now.getMonth()
  const initDayIdx = Math.min(now.getDate() - 1, daysInMonth(YEAR_LIST[0], MONTH_LIST[initMonthIdx]) - 1)
  const initHourIdx = now.getHours()
  const initMinIdx = 0

  const ranges = ref<number[][]>([
    YEAR_LIST,
    MONTH_LIST,
    makeDayList(initYearIdx, initMonthIdx),
    HOUR_LIST,
    MINUTE_LIST,
  ])
  const indices = ref<number[]>([initYearIdx, initMonthIdx, initDayIdx, initHourIdx, initMinIdx])
  const text = ref('')

  function updateText() {
    const [yi, mi, di, hi, mini] = indices.value
    text.value = formatTime(
      YEAR_LIST[yi],
      MONTH_LIST[mi],
      ranges.value[2][di] ?? 1,
      HOUR_LIST[hi],
      MINUTE_LIST[mini],
    )
  }

  function onColumnChange(e: any) {
    const col = e.detail.column as number
    const newIdx = e.detail.value as number
    indices.value[col] = newIdx

    // 年或月变了 → 重建日列表
    if (col === 0 || col === 1) {
      const yi = indices.value[0]
      const mi = indices.value[1]
      ranges.value[2] = makeDayList(yi, mi)
      // 日索引可能越界，修正到最后一号
      if (indices.value[2] >= ranges.value[2].length) {
        indices.value[2] = ranges.value[2].length - 1
      }
    }
  }

  function onChange(e: any) {
    indices.value = e.detail.value
    updateText()
  }

  // 初始文本
  updateText()

  return { ranges, indices, text, onColumnChange, onChange }
}

const startPicker = createTimePicker()
const endPicker = createTimePicker()
const deadlinePicker = createTimePicker()

// 绑定到 form

function onTypeChange(e: any) {
  form.activityType = activityTypes[e.detail.value]
}

// ---- 封面图 ----
function pickCover() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      form.coverImageUrl = res.tempFilePaths[0]
    },
  })
}

// ---- 标签 ----
function addTag() {
  const val = tagInput.value.trim()
  if (!val) return
  if (form.tags.length >= 5) {
    uni.showToast({ title: '最多添加5个标签', icon: 'none' })
    return
  }
  if (form.tags.includes(val)) {
    uni.showToast({ title: '标签已存在', icon: 'none' })
    return
  }
  form.tags.push(val)
  tagInput.value = ''
  showTagInput.value = false
}

function removeTag(idx: number) {
  form.tags.splice(idx, 1)
}

// ---- 地图选点 ----
function pickLocation() {
  navigateTo(routes.locationPicker)
}

onShow(() => {
  // 方式1: 通过 app.globalData（navigateBack 回调）
  const app = getApp()
  const picked = app?.globalData?.__pickedLocation
  if (picked && picked.latitude) {
    form.locationLat = picked.latitude
    form.locationLng = picked.longitude
    form.locationName = picked.address || `${picked.latitude.toFixed(5)}, ${picked.longitude.toFixed(5)}`
    if (picked.city) form.city = picked.city
    if (app.globalData) {
      app.globalData.__pickedLocation = null
    }
  }
})

// 方式2: 通过 uni.$on 事件（双重保障）
uni.$on('locationPicked', (picked: any) => {
  if (picked && picked.latitude) {
    form.locationLat = picked.latitude
    form.locationLng = picked.longitude
    form.locationName = picked.address || `${picked.latitude.toFixed(5)}, ${picked.longitude.toFixed(5)}`
    if (picked.city) form.city = picked.city
  }
})

// ---- 校验与提交 ----
function validate(): boolean {
  if (!form.title.trim()) { errors.value = '请填写活动名称'; return false }
  if (!form.activityType) { errors.value = '请选择活动类型'; return false }
  if (!form.description.trim()) { errors.value = '请填写活动简介'; return false }
  if (!startPicker.text.value) { errors.value = '请选择开始时间'; return false }
  if (!endPicker.text.value) { errors.value = '请选择结束时间'; return false }
  if (startPicker.text.value >= endPicker.text.value) { errors.value = '结束时间必须晚于开始时间'; return false }
  if (!deadlinePicker.text.value) { errors.value = '请选择报名截止时间'; return false }
  if (deadlinePicker.text.value >= startPicker.text.value) { errors.value = '报名截止时间必须早于开始时间'; return false }
  const max = Number(form.maxParticipants)
  if (!max || max <= 0) { errors.value = '人数上限必须大于0'; return false }
  if (form.feeType === 'paid') {
    const fee = Number(form.feeAmount)
    if (isNaN(fee) || fee < 0) { errors.value = '请输入有效的费用金额'; return false }
  }
  if (!form.locationLat || !form.locationLng) { errors.value = '请进行地图选点'; return false }
  errors.value = ''
  return true
}

function saveDraft() {
  if (!form.title.trim()) {
    uni.showToast({ title: '请至少填写活动名称', icon: 'none' })
    return
  }
  uni.setStorageSync('activity_draft', { ...form, status: 'draft' })
  uni.showToast({ title: '草稿已保存', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 800)
}

async function submit() {
  if (!validate()) {
    uni.showToast({ title: errors.value, icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await request({
      url: '/activities',
      method: 'POST',
      data: {
        title: form.title,
        description: form.description,
        tags: form.tags,
        activity_type: form.activityType,
        start_time: startPicker.text.value,
        end_time: endPicker.text.value,
        registration_deadline: deadlinePicker.text.value,
        max_participants: form.maxParticipants,
        min_credit_score: form.minCreditScore,
        fee_type: form.feeType,
        fee_amount: form.feeType === 'paid' ? form.feeAmount : 0,
        location_name: form.locationName,
        location_lat: form.locationLat,
        location_lng: form.locationLng,
        city: form.city || '',
      },
    })
    uni.setStorageSync('activity_draft', null)
    uni.showToast({ title: '提交成功，等待审核', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e: any) {
    uni.showToast({ title: e.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: 160rpx;
  background: #f6f8f7;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.section {
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.section-title {
  color: #101828;
  font-size: 28rpx;
  font-weight: 800;
}

.input {
  height: 84rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;

  &.num {
    flex: 1;
    text-align: right;
  }
}

.picker-field {
  height: 84rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;

  .placeholder {
    color: #9ca3af;
  }
}

.cover-row {
  width: 100%;
  height: 320rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed #d0d5dd;
  border-radius: 12rpx;
  background: #f9fafb;
  color: #9ca3af;
  font-size: 26rpx;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.tag-close {
  font-size: 20rpx;
}

.tag-add {
  background: #f2f4f7;
  color: #475467;
  border: 1rpx dashed #d0d5dd;
}

.tag-input-row {
  display: flex;
  gap: 12rpx;
}

.tag-input {
  flex: 1;
  height: 64rpx;
  padding: 0 16rpx;
  border: 1rpx solid #d0d5dd;
  border-radius: 10rpx;
  font-size: 26rpx;
  background: #ffffff;
}

.tag-confirm {
  height: 64rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
}

.textarea {
  width: 100%;
  height: 200rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;
  box-sizing: border-box;
}

.counter {
  text-align: right;
  color: #667085;
  font-size: 22rpx;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.input-label {
  flex-shrink: 0;
  width: 150rpx;
  color: #475467;
  font-size: 26rpx;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.switch-group {
  display: flex;
  gap: 0;
  border-radius: 10rpx;
  overflow: hidden;
}

.switch-item {
  padding: 16rpx 32rpx;
  background: #f2f4f7;
  color: #475467;
  font-size: 26rpx;

  &.active {
    background: #16a34a;
    color: #ffffff;
    font-weight: 700;
  }
}

.location-row {
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
}

.location-main {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
}

.location-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #15803d;
  font-size: 26rpx;
  font-weight: 600;
}

.location-placeholder {
  color: #9ca3af;
  font-size: 26rpx;
}

.error-msg {
  color: #dd524d;
  font-size: 26rpx;
  padding: 0 8rpx;
}

.bottom-btns {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 24rpx 40rpx;
  background: #ffffff;
  display: flex;
  gap: 16rpx;
}

.btn-draft,
.btn-submit {
  flex: 1;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  font-size: 30rpx;
  font-weight: 800;
}

.btn-draft {
  background: #f2f4f7;
  color: #475467;
}

.btn-submit {
  background: #16a34a;
  color: #ffffff;
}
</style>
