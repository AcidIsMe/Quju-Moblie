<template>
  <view class="page">
    <!-- 头像 -->
    <view class="avatar-row" @tap="pickAvatar">
      <view class="avatar">
        <image v-if="avatarUrl" :src="avatarUrl" mode="aspectFill" class="avatar-img" />
        <text v-else class="avatar-text">{{ avatarInitial }}</text>
      </view>
      <text class="avatar-hint">点击更换头像</text>
    </view>

    <!-- 昵称 -->
    <view class="field">
      <text class="label">昵称</text>
      <input v-model="nickname" class="input" placeholder="2-50字" @blur="validateNickname" />
      <text v-if="errors.nickname" class="error-text">{{ errors.nickname }}</text>
    </view>

    <!-- 性别 -->
    <view class="field">
      <text class="label">性别</text>
      <view class="gender-row">
        <view
          v-for="item in genderOptions"
          :key="item.value"
          class="gender-item"
          :class="{ active: gender === item.value }"
          @tap="gender = item.value"
        >
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 生日 -->
    <view class="field">
      <text class="label">生日</text>
      <picker mode="date" :value="birthday" :end="today" @change="onBirthdayChange">
        <view class="picker">{{ birthday || '请选择生日' }}</view>
      </picker>
    </view>

    <!-- 个性签名 -->
    <view class="field">
      <text class="label">个性签名</text>
      <textarea v-model="bio" class="textarea" placeholder="介绍一下自己" :maxlength="200" />
      <text class="counter">{{ bio.length }}/200</text>
    </view>

    <!-- 兴趣标签 -->
    <view class="field">
      <text class="label">兴趣标签</text>
      <view class="tag-list">
        <view v-for="(tag, idx) in tags" :key="idx" class="tag">
          <text>{{ tag }}</text>
          <text class="tag-close" @tap="removeTag(idx)">x</text>
        </view>
        <view v-if="tags.length < 8" class="tag tag-add" @tap="showTagInput">
          <text>+ 添加</text>
        </view>
      </view>
      <view v-if="showAddTag" class="tag-input-row">
        <input
          v-model="tagInput"
          class="tag-input"
          placeholder="输入标签，回车确认"
          :maxlength="10"
          @confirm="addTag"
        />
        <button class="tag-confirm" @tap="addTag">确认</button>
      </view>
    </view>

    <!-- 保存 -->
    <button class="primary-btn" :disabled="saving" @tap="save">
      {{ saving ? '保存中...' : '保存' }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
auth.restore()

const user = auth.state.user

const genderOptions = [
  { label: '保密', value: 'other' },
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
] as const

const avatarUrl = ref(user?.avatar_url || '')
const nickname = ref(user?.nickname || '')
const gender = ref<'male' | 'female' | 'other'>(user?.gender || 'other')
const birthday = ref(user?.birthday || '')
const bio = ref(user?.bio || '')
const tags = ref<string[]>([...(user?.interest_tags || [])])
const tagInput = ref('')
const showAddTag = ref(false)
const saving = ref(false)
const errors = ref({ nickname: '' })

const today = new Date().toISOString().slice(0, 10)
const avatarInitial = nickname.value?.slice(0, 1) || '趣'

function validateNickname() {
  const v = nickname.value.trim()
  if (!v) {
    errors.value.nickname = '昵称不能为空'
  } else if (v.length < 2) {
    errors.value.nickname = '昵称至少2个字'
  } else if (v.length > 50) {
    errors.value.nickname = '昵称不能超过50字'
  } else {
    errors.value.nickname = ''
  }
}

function pickAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      avatarUrl.value = res.tempFilePaths[0]
      // 对接真实接口后调用 POST /api/files/upload
    },
    fail() {
      // 用户取消
    },
  })
}

function onBirthdayChange(e: any) {
  birthday.value = e.detail.value
}

function showTagInput() {
  showAddTag.value = true
}

function addTag() {
  const val = tagInput.value.trim()
  if (!val) return
  if (tags.value.length >= 8) {
    uni.showToast({ title: '最多添加8个标签', icon: 'none' })
    return
  }
  if (tags.value.includes(val)) {
    uni.showToast({ title: '标签已存在', icon: 'none' })
    return
  }
  tags.value.push(val)
  tagInput.value = ''
  showAddTag.value = false
}

function removeTag(idx: number) {
  tags.value.splice(idx, 1)
}

async function save() {
  validateNickname()
  if (errors.value.nickname) return

  try {
    saving.value = true
    if (auth.state.user) {
      auth.state.user.nickname = nickname.value.trim()
      auth.state.user.avatar_url = avatarUrl.value
      auth.state.user.gender = gender.value
      auth.state.user.birthday = birthday.value
      auth.state.user.bio = bio.value.slice(0, 200)
      auth.state.user.interest_tags = tags.value
      uni.setStorageSync('current_user', auth.state.user)
    }
    uni.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #f6f8f7;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-text {
  color: #15803d;
  font-size: 48rpx;
  font-weight: 900;
}

.avatar-hint {
  color: #667085;
  font-size: 26rpx;
}

.field {
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.label {
  display: block;
  margin-bottom: 16rpx;
  color: #475467;
  font-size: 26rpx;
  font-weight: 600;
}

.input {
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  color: #101828;
  font-size: 28rpx;
  background: #f9fafb;
}

.error-text {
  display: block;
  margin-top: 8rpx;
  color: #dd524d;
  font-size: 24rpx;
}

.gender-row {
  display: flex;
  gap: 16rpx;
}

.gender-item {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10rpx;
  background: #f2f4f7;
  color: #475467;
  font-size: 26rpx;

  &.active {
    background: #dcfce7;
    color: #15803d;
    font-weight: 700;
  }
}

.picker {
  height: 80rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;
}

.textarea {
  width: 100%;
  height: 160rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  background: #f9fafb;
  color: #101828;
  font-size: 28rpx;
  box-sizing: border-box;
}

.counter {
  display: block;
  margin-top: 8rpx;
  text-align: right;
  color: #667085;
  font-size: 22rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.tag {
  padding: 10rpx 18rpx;
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
  color: #15803d;
  padding: 2rpx 6rpx;
}

.tag-add {
  background: #f2f4f7;
  color: #475467;
  border: 1rpx dashed #d0d5dd;
}

.tag-input-row {
  display: flex;
  gap: 12rpx;
  margin-top: 12rpx;
}

.tag-input {
  flex: 1;
  height: 68rpx;
  padding: 0 16rpx;
  border: 1rpx solid #d0d5dd;
  border-radius: 10rpx;
  font-size: 26rpx;
  background: #ffffff;
}

.tag-confirm {
  height: 68rpx;
  padding: 0 24rpx;
  border-radius: 10rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 600;
}

.primary-btn {
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
}
</style>
