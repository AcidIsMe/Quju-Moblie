# 趣聚移动端

趣聚是一个以兴趣为纽带的线下活动社交平台。本仓库用于承载趣聚移动端前端，目标技术栈为 uni-app，并优先面向微信小程序。

当前阶段已完成需求梳理、页面规划和 uni-app 小程序前端骨架搭建。

## 文档

- [平台需求](./docs/“趣聚”平台需求.md)
- [API 与数据库设计](./docs/API与数据库设计.md)
- [用户故事与首次迭代计划](./docs/用户故事与首次迭代计划_V2.md)
- [uni-app 小程序前端页面规划](./docs/前端页面规划_uniapp小程序.md)

## 前端范围

小程序端优先覆盖普通用户和商家用户的移动端流程：

- 注册、登录、个人资料管理
- 活动首页信息流、搜索、筛选、地图模式
- 活动详情、报名、取消报名、等待队列
- 活动创建、地图选点、草稿、模板、AI 策划
- 通知、好友、关注、小队等社交能力
- 签到、评价、活动图文总结

管理员后台不建议放入小程序端，后续应作为独立 Web 管理端实现。

## 迭代优先级

迭代 1 先跑通 P0 闭环：

```text
注册 -> 登录 -> 创建活动 -> 审核 -> 首页发现 -> 活动详情 -> 报名 -> 取消报名
```

迭代 2 再补齐商家入驻、活动模板、草稿、高级筛选、等待队列、签到、评价、好友和关注等 P1 能力。

## 技术栈

- uni-app
- Vue 3
- TypeScript
- Vite
- @dcloudio/uni-ui

## 本地开发

安装依赖：

```bash
npm install
```

启动微信小程序开发构建：

```bash
npm run dev:mp-weixin
```

构建微信小程序产物：

```bash
npm run build:mp-weixin
```

类型检查：

```bash
npm run type-check
```

微信开发者工具调试：

- 开发模式导入 `dist/dev/mp-weixin`
- 构建模式导入 `dist/build/mp-weixin`

## 微信开发者工具配置

- `project.config.json`：通常作为团队共享配置提交，包含编译设置和小程序 AppID。
- `project.private.config.json`：个人本地配置，已加入 `.gitignore`，不应提交。

如果团队希望隐藏小程序 AppID，可以把 `project.config.json` 也加入忽略，并提供一个 `project.config.example.json` 模板。

## 当前骨架

项目已按主包 + 分包结构搭建：

- `src/pages`：启动、认证、首页、发布、消息、我的
- `src/subpkg-activity`：活动详情、搜索、地图、创建、报名、我的活动
- `src/subpkg-user`：资料、个人主页、商家能力
- `src/subpkg-social`：好友和小队
- `src/subpkg-activity-plus`：模板、草稿、签到、评价、总结
- `src/components`：活动卡片、状态标签、标签列表、空状态、占位页
- `src/services`：请求封装、认证和活动发现 mock 服务
- `src/stores`：登录态和位置状态

目前接口层先使用 mock 数据，后续后端接口可在 `src/services` 中逐步替换。
