# 趣聚 uni-app 微信小程序前端页面规划

本文基于以下文档整理小程序端前端页面范围：

- `docs/“趣聚”平台需求.md`
- `docs/API与数据库设计.md`
- `docs/用户故事与首次迭代计划_V2.md`

说明：本文只规划 uni-app 微信小程序端。管理员后台在需求与迭代计划中存在，但更适合独立 Web 管理端实现；小程序端仅承接普通用户、商家用户在移动端的活动发现、发布、报名、社交与个人中心能力。

---

## 1. 页面规划原则

1. 迭代 1 优先跑通 P0 闭环：注册/登录 -> 首页发现 -> 创建活动 -> 活动详情 -> 报名 -> 取消报名 -> 我的活动状态查看。
2. 地图模式是 P0 必须项，需要在首页附近 Tab 和搜索页都有入口。
3. 活动创建表单先保证手动创建和地图选点，AI 策划、模板、草稿放入迭代 2。
4. 好友、小队、评价、签到、商家能力作为 P1/P2 逐步扩展，不阻塞首轮演示闭环。
5. uni-app 侧采用主包 + 分包，保证小程序冷启动 < 5 秒。

---

## 2. 小程序信息架构

### 2.1 TabBar 建议

| Tab | 页面 | 路由 | 迭代 | 说明 |
|---|---|---|---|---|
| 首页 | 活动发现 | `/pages/home/index` | P0 | 推荐、最新、附近三 Tab 信息流 |
| 发布 | 创建活动入口 | `/pages/publish/index` | P0 | 进入手动创建，后续扩展 AI/模板/草稿 |
| 消息 | 通知中心 | `/pages/notifications/index` | P0/P1 | P0 展示活动审核/报名类通知，P1 扩展好友/小队通知 |
| 我的 | 个人中心 | `/pages/me/index` | P0 | 资料、我发布的、我报名的、设置 |

### 2.2 主流程

```text
启动页
  -> 未登录：登录/注册
  -> 已登录：首页

首页
  -> 活动列表
  -> 搜索页
  -> 地图模式
  -> 活动详情
  -> 报名确认

发布
  -> 创建活动表单
  -> 地图选点
  -> 提交审核
  -> 发布结果/审核状态

我的
  -> 编辑资料
  -> 我发布的活动
  -> 我报名的活动
  -> 活动管理/参与者/取消报名
```

---

## 3. 推荐目录与分包

```text
src/
├── pages/
│   ├── launch/index.vue
│   ├── auth/login.vue
│   ├── auth/register.vue
│   ├── home/index.vue
│   ├── publish/index.vue
│   ├── notifications/index.vue
│   └── me/index.vue
├── subpkg-activity/
│   ├── detail/index.vue
│   ├── search/index.vue
│   ├── map/index.vue
│   ├── create/index.vue
│   ├── location-picker/index.vue
│   ├── registration-confirm/index.vue
│   ├── my-created/index.vue
│   ├── my-joined/index.vue
│   └── participants/index.vue
├── subpkg-user/
│   ├── profile-edit/index.vue
│   ├── public-profile/index.vue
│   ├── merchant-register/index.vue
│   └── merchant-profile/index.vue
├── subpkg-social/
│   ├── friends/index.vue
│   ├── friend-requests/index.vue
│   ├── teams/index.vue
│   ├── team-detail/index.vue
│   └── team-create/index.vue
├── subpkg-activity-plus/
│   ├── templates/index.vue
│   ├── drafts/index.vue
│   ├── check-in/index.vue
│   ├── check-in-manage/index.vue
│   ├── reviews/index.vue
│   └── summary-edit/index.vue
├── components/
│   ├── activity-card.vue
│   ├── activity-status-tag.vue
│   ├── user-avatar.vue
│   ├── tag-list.vue
│   ├── empty-state.vue
│   └── load-more.vue
├── services/
│   ├── http.ts
│   ├── auth.ts
│   ├── users.ts
│   ├── activities.ts
│   ├── discover.ts
│   ├── registrations.ts
│   └── notifications.ts
└── stores/
    ├── auth.ts
    ├── user.ts
    └── location.ts
```

---

## 4. 页面清单

### 4.1 启动与认证

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 启动页 | `/pages/launch/index` | P0 | 判断 token、拉取用户信息、路由分发 | `GET /api/users/me`, `POST /api/auth/refresh` |
| 登录页 | `/pages/auth/login` | P0 | 邮箱、密码、错误提示、登录锁定提示 | `POST /api/auth/login` |
| 个人注册页 | `/pages/auth/register` | P0 | 邮箱、密码、昵称、注册成功提示激活邮箱 | `POST /api/auth/register/personal`, `GET /api/users/check-nickname` |
| 商家注册页 | `/subpkg-user/merchant-register/index` | P1 | 商家资料、营业执照上传、提交审核 | `POST /api/auth/register/merchant`, `POST /api/files/upload` |

### 4.2 首页发现

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 首页 | `/pages/home/index` | P0 | 推荐/最新/附近 Tab、活动卡片、下拉刷新、触底分页 | `GET /api/discover/recommended`, `GET /api/discover/latest`, `GET /api/discover/nearby` |
| 搜索页 | `/subpkg-activity/search/index` | P0 | 关键词搜索、热门推荐、搜索结果、筛选入口 | `GET /api/discover/search`, P1: `GET /api/discover/filter` |
| 地图模式 | `/subpkg-activity/map/index` | P0 | 微信 map 组件、当前位置、活动 markers、点位摘要卡片 | `GET /api/discover/map` |
| 高级筛选弹层/页 | 可作为搜索页内组件 | P1 | 类型多选、时间、城市、费用、距离、清除筛选 | `GET /api/discover/filter` |

首页活动卡片建议展示：封面图、标题、标签、时间、地点、距离、费用、已报人数/上限、状态标签。

### 4.3 活动详情与报名

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 活动详情 | `/subpkg-activity/detail/index?id=` | P0 | 完整信息、状态标签、地图缩略图、发起人、报名按钮联动 | `GET /api/activities/:id`, P1: `GET /api/activities/:id/reviews`, `GET /api/activities/:id/summary` |
| 报名确认 | `/subpkg-activity/registration-confirm/index?id=` | P0 | 安全须知、报名表单、校验失败提示、确认报名 | `POST /api/activities/:id/register` |
| 我报名的活动 | `/subpkg-activity/my-joined/index` | P0 | 已报名/已取消/已结束列表、取消报名入口 | `GET /api/users/me/joined-activities`, `POST /api/activities/:id/cancel-registration` |
| 等待队列状态 | 可并入详情页/报名确认页 | P1 | 名额满时加入等待、展示等待人数、退出等待 | `POST /api/activities/:id/join-waitlist`, `DELETE /api/activities/:id/leave-waitlist` |

详情页底部按钮状态：

| 状态 | 按钮 |
|---|---|
| 报名中且有名额 | 立即报名 |
| 已报名且未截止 | 取消报名 |
| 已报名且活动开始后 | 查看签到/活动信息 |
| 已满员 | 加入等待队列 |
| 报名截止/活动中/已结束 | 禁用或展示状态说明 |

### 4.4 活动发布与管理

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 发布入口 | `/pages/publish/index` | P0 | 手动创建入口，P1 展示 AI 策划、模板、草稿 | - |
| 创建活动 | `/subpkg-activity/create/index` | P0 | 标题、标签、简介、封面、时间、城市、费用、人数、截止时间、地图选点 | `POST /api/activities`, `PUT /api/activities/:id`, `POST /api/files/upload` |
| 地图选点 | `/subpkg-activity/location-picker/index` | P0 | 微信地图选点、定位、逆地理地址回填 | 微信定位/地图能力，后端保存坐标 |
| 我发布的活动 | `/subpkg-activity/my-created/index` | P0 | 草稿/审核中/已发布/已驳回/已下架/已结束列表 | `GET /api/users/me/created-activities` |
| 参与者列表 | `/subpkg-activity/participants/index?id=` | P0/P1 | 报名用户、签到状态、发起人查看 | `GET /api/activities/:id/participants`, P1: `GET /api/activities/:id/check-in/list` |
| 活动模板 | `/subpkg-activity-plus/templates/index` | P1 | 六大分类模板、使用模板 | `GET /api/templates`, `POST /api/templates/:id/use` |
| 草稿箱 | `/subpkg-activity-plus/drafts/index` | P1 | 草稿列表、继续编辑、删除草稿 | `GET /api/users/me/created-activities?status=draft`, `DELETE /api/activities/:id` |
| AI 策划入口 | 可并入创建页 | P2 | 输入主题、AI 回填表单 | `POST /api/ai/generate-activity` |

### 4.5 签到、评价与总结

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 扫码签到 | `/subpkg-activity-plus/check-in/index` | P1 | 扫码、位置校验、签到结果 | `POST /api/activities/:id/check-in` |
| 签到管理 | `/subpkg-activity-plus/check-in-manage/index?id=` | P1 | 生成二维码、签到名单、签到率 | `POST /api/activities/:id/check-in/qrcode`, `GET /api/activities/:id/check-in/list` |
| 评价列表/提交 | `/subpkg-activity-plus/reviews/index?id=` | P1 | 活动评价、结束后限时评价入口 | `GET /api/activities/:id/reviews`, `POST /api/activities/:id/reviews` |
| 图文总结编辑 | `/subpkg-activity-plus/summary-edit/index?id=` | P2 | 图片上传、AI 分类确认、发布总结 | `POST /api/files/upload`, `POST /api/ai/classify-images`, `POST /api/activities/:id/summary` |

### 4.6 个人中心

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 我的 | `/pages/me/index` | P0 | 头像昵称、信誉分、兴趣标签、我发布的、我报名的、资料编辑、退出登录 | `GET /api/users/me`, `POST /api/auth/logout` |
| 编辑资料 | `/subpkg-user/profile-edit/index` | P0 | 头像、昵称、性别、生日、签名、兴趣标签 | `PATCH /api/users/me`, `POST /api/files/upload`, `GET /api/users/check-nickname` |
| 用户公开主页 | `/subpkg-user/public-profile/index?id=` | P1 | 公开资料、关注/好友入口、公开活动 | `GET /api/users/:id`, P1: `POST /api/follows/:userId`, `POST /api/friends/requests` |
| 商家资料 | `/subpkg-user/merchant-profile/index` | P1 | 商家名称、商家昵称、活动领域 | 后端需补商家资料接口或复用用户资料扩展 |

### 4.7 通知与社交

| 页面 | 路由 | 优先级 | 主要内容 | 主要接口 |
|---|---|---|---|---|
| 通知中心 | `/pages/notifications/index` | P0/P1 | 活动审核、报名、等待队列、好友申请、小队申请通知 | `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `POST /api/notifications/read-all` |
| 好友列表 | `/subpkg-social/friends/index` | P1 | 好友列表、分组、备注、删除好友 | `GET /api/friends`, `PATCH /api/friends/:userId`, `DELETE /api/friends/:userId` |
| 好友申请 | `/subpkg-social/friend-requests/index` | P1 | 收到/发出的申请、同意/拒绝 | `GET /api/friends/requests/received`, `GET /api/friends/requests/sent`, `POST /api/friends/requests/:id/accept`, `POST /api/friends/requests/:id/reject` |
| 小队发现 | `/subpkg-social/teams/index` | P2 | 搜索小队、标签筛选、加入入口 | `GET /api/teams` |
| 小队详情 | `/subpkg-social/team-detail/index?id=` | P2 | 小队资料、成员、加入/退出、小队活动 | `GET /api/teams/:id`, `POST /api/teams/:id/join`, `POST /api/teams/:id/leave` |
| 创建小队 | `/subpkg-social/team-create/index` | P2 | 名称、简介、标签、加入方式、人数上限 | `POST /api/teams` |

即时通讯、小队群聊、小队相册、积分榜在用户故事中为 Won't/P3 或后续能力，首版不进入小程序页面实现。

---

## 5. `pages.json` 路由草案

```json
{
  "pages": [
    { "path": "pages/launch/index", "style": { "navigationBarTitleText": "趣聚" } },
    { "path": "pages/auth/login", "style": { "navigationBarTitleText": "登录" } },
    { "path": "pages/auth/register", "style": { "navigationBarTitleText": "注册" } },
    { "path": "pages/home/index", "style": { "navigationBarTitleText": "趣聚" } },
    { "path": "pages/publish/index", "style": { "navigationBarTitleText": "发布活动" } },
    { "path": "pages/notifications/index", "style": { "navigationBarTitleText": "消息" } },
    { "path": "pages/me/index", "style": { "navigationBarTitleText": "我的" } }
  ],
  "subPackages": [
    {
      "root": "subpkg-activity",
      "pages": [
        { "path": "detail/index", "style": { "navigationBarTitleText": "活动详情" } },
        { "path": "search/index", "style": { "navigationBarTitleText": "搜索活动" } },
        { "path": "map/index", "style": { "navigationBarTitleText": "地图模式" } },
        { "path": "create/index", "style": { "navigationBarTitleText": "创建活动" } },
        { "path": "location-picker/index", "style": { "navigationBarTitleText": "选择地点" } },
        { "path": "registration-confirm/index", "style": { "navigationBarTitleText": "确认报名" } },
        { "path": "my-created/index", "style": { "navigationBarTitleText": "我发布的" } },
        { "path": "my-joined/index", "style": { "navigationBarTitleText": "我报名的" } },
        { "path": "participants/index", "style": { "navigationBarTitleText": "参与者" } }
      ]
    },
    {
      "root": "subpkg-user",
      "pages": [
        { "path": "profile-edit/index", "style": { "navigationBarTitleText": "编辑资料" } },
        { "path": "public-profile/index", "style": { "navigationBarTitleText": "个人主页" } },
        { "path": "merchant-register/index", "style": { "navigationBarTitleText": "商家入驻" } },
        { "path": "merchant-profile/index", "style": { "navigationBarTitleText": "商家资料" } }
      ]
    },
    {
      "root": "subpkg-social",
      "pages": [
        { "path": "friends/index", "style": { "navigationBarTitleText": "好友" } },
        { "path": "friend-requests/index", "style": { "navigationBarTitleText": "好友申请" } },
        { "path": "teams/index", "style": { "navigationBarTitleText": "小队" } },
        { "path": "team-detail/index", "style": { "navigationBarTitleText": "小队详情" } },
        { "path": "team-create/index", "style": { "navigationBarTitleText": "创建小队" } }
      ]
    },
    {
      "root": "subpkg-activity-plus",
      "pages": [
        { "path": "templates/index", "style": { "navigationBarTitleText": "活动模板" } },
        { "path": "drafts/index", "style": { "navigationBarTitleText": "草稿箱" } },
        { "path": "check-in/index", "style": { "navigationBarTitleText": "扫码签到" } },
        { "path": "check-in-manage/index", "style": { "navigationBarTitleText": "签到管理" } },
        { "path": "reviews/index", "style": { "navigationBarTitleText": "活动评价" } },
        { "path": "summary-edit/index", "style": { "navigationBarTitleText": "活动总结" } }
      ]
    }
  ],
  "tabBar": {
    "color": "#6B7280",
    "selectedColor": "#16A34A",
    "list": [
      { "pagePath": "pages/home/index", "text": "首页" },
      { "pagePath": "pages/publish/index", "text": "发布" },
      { "pagePath": "pages/notifications/index", "text": "消息" },
      { "pagePath": "pages/me/index", "text": "我的" }
    ]
  }
}
```

---

## 6. 迭代落地顺序

### 迭代 1：P0 小程序页面

1. 认证闭环：启动页、登录页、注册页。
2. 用户资料：我的、编辑资料。
3. 活动发现：首页、搜索页、地图模式、活动详情。
4. 活动发布：发布入口、创建活动、地图选点、我发布的活动。
5. 报名闭环：报名确认、我报名的活动、取消报名。
6. 通知中心：先支持活动发布/驳回/系统通知列表。

### 迭代 2：P1 小程序页面

1. 商家入驻与商家资料。
2. 活动模板、草稿箱、高级筛选、等待队列。
3. 扫码签到、签到管理、评价。
4. 好友列表、好友申请、用户公开主页关注/好友入口。

### 后续：P2/P3 页面

1. AI 活动策划增强、活动图文总结。
2. 小队发现、创建、详情、权限管理。
3. 小队相册、积分榜、即时通讯等重社交能力。

---

## 7. 关键组件规划

| 组件 | 用途 |
|---|---|
| `activity-card` | 首页、搜索、我的活动复用活动卡片 |
| `activity-status-tag` | 报名中、已截止、活动中、已结束、审核中、已驳回、已下架 |
| `tag-list` | 活动标签、兴趣标签、小队标签 |
| `user-avatar` | 用户头像兜底、昵称首字兜底 |
| `load-more` | 游标分页底部加载状态 |
| `empty-state` | 无搜索结果、无草稿、无报名记录 |
| `location-permission-panel` | 附近 Tab 与地图模式位置授权提示 |
| `safe-notice-modal` | 报名确认安全须知弹窗 |
| `image-uploader` | 头像、活动封面、商家执照、总结图片上传 |

---

## 8. 前端状态与通用能力

| 模块 | 说明 |
|---|---|
| `authStore` | access_token、refresh_token、登录态、退出登录 |
| `userStore` | 当前用户资料、角色、状态、信誉分 |
| `locationStore` | 位置授权状态、当前经纬度、城市 |
| `http` 拦截器 | 统一拼接 baseURL、Authorization、401 刷新 token/跳登录、错误 toast |
| 分页工具 | 封装 `next_cursor`、`has_more`、`limit=20` |
| 上传工具 | 封装 `uni.uploadFile` 对接 `/api/files/upload` |
| 地图工具 | 封装 `uni.getLocation`、微信 map markers、视野变化重新加载 |

---

## 9. 风险点

1. 邮箱激活在微信小程序内体验较弱，注册成功页需要明确提示用户去邮箱激活，再返回登录。
2. 地图选点与地图模式都依赖位置权限，需要处理拒绝授权、二次授权指引、定位失败。
3. 活动创建表单字段多，建议按区块分组：基础信息、时间地点、参与设置、费用与封面。
4. 活动状态多，详情页和我的活动列表必须统一由前端状态映射函数处理，避免按钮状态分散。
5. 微信小程序包体受限，地图、社交、签到、总结等页面应分包加载。
6. 管理员后台不建议塞进小程序端，否则会拖慢主流程并增加权限复杂度。
