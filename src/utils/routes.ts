export const routes = {
  launch: '/pages/launch/index',
  login: '/pages/auth/login',
  register: '/pages/auth/register',
  home: '/pages/home/index',
  publish: '/pages/publish/index',
  notifications: '/pages/notifications/index',
  me: '/pages/me/index',
  activityDetail: '/subpkg-activity/detail/index',
  activitySearch: '/subpkg-activity/search/index',
  activityMap: '/subpkg-activity/map/index',
  activityCreate: '/subpkg-activity/create/index',
  locationPicker: '/subpkg-activity/location-picker/index',
  registrationConfirm: '/subpkg-activity/registration-confirm/index',
  myCreated: '/subpkg-activity/my-created/index',
  myJoined: '/subpkg-activity/my-joined/index',
  participants: '/subpkg-activity/participants/index',
  profileEdit: '/subpkg-user/profile-edit/index',
  publicProfile: '/subpkg-user/public-profile/index',
  merchantRegister: '/subpkg-user/merchant-register/index',
  merchantProfile: '/subpkg-user/merchant-profile/index',
  friends: '/subpkg-social/friends/index',
  friendRequests: '/subpkg-social/friend-requests/index',
  teams: '/subpkg-social/teams/index',
  teamDetail: '/subpkg-social/team-detail/index',
  teamCreate: '/subpkg-social/team-create/index',
  templates: '/subpkg-activity-plus/templates/index',
  drafts: '/subpkg-activity-plus/drafts/index',
  checkIn: '/subpkg-activity-plus/check-in/index',
  checkInManage: '/subpkg-activity-plus/check-in-manage/index',
  reviews: '/subpkg-activity-plus/reviews/index',
  summaryEdit: '/subpkg-activity-plus/summary-edit/index',
}

export function navigateTo(url: string) {
  uni.navigateTo({ url })
}

export function switchTab(url: string) {
  uni.switchTab({ url })
}
