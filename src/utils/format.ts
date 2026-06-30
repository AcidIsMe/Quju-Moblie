import type { ActivityStatus } from '../types/domain'

export function statusText(status: ActivityStatus) {
  const map: Record<ActivityStatus, string> = {
    draft: '草稿',
    pending_ai_review: 'AI审核中',
    pending_manual_review: '人工审核中',
    published: '报名中',
    rejected: '已驳回',
    taken_down: '已下架',
    ended: '已结束',
  }
  return map[status]
}

export function formatFee(feeType: 'free' | 'paid' | undefined, amount: number | undefined) {
  if (feeType === 'free' || !amount || amount <= 0) return '免费'
  return `￥${amount.toFixed(2)}`
}

export function formatCapacity(current: number, max: number) {
  return `${current}/${max} 人`
}
