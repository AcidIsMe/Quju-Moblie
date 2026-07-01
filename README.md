# 趣聚移动端

趣聚是一个围绕兴趣和线下活动展开的移动端社交产品。用户可以发现同城活动、报名参与、发布自己的活动，也可以通过好友、小队、通知等能力沉淀更稳定的社交关系。

本仓库是趣聚移动端前端项目，基于 uni-app 构建，当前优先面向微信小程序。

## 项目定位

移动端主要覆盖普通用户和商家用户的核心使用场景：

- 用户注册、登录和个人资料管理
- 首页活动发现、搜索、地图浏览和活动详情
- 活动报名、取消报名、签到、评价和总结
- 活动发布、草稿、模板和发布管理
- 通知、好友、小队等社交能力
- 商家入驻和商家资料展示

后台审核、平台运营、复杂数据管理等能力更适合放在独立 Web 管理端中实现。

## 技术栈

- uni-app
- Vue 3
- TypeScript
- Vite
- @dcloudio/uni-ui

## 本地运行

安装依赖：

```bash
npm install
```

启动微信小程序开发模式：

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

日常开发建议使用 `npm run dev:mp-weixin`，并在微信开发者工具中打开 `dist/dev/mp-weixin`。发布或提交体验版前再执行构建命令。

## 后端接口

项目的接口请求统一放在 `src/services` 中，基础请求封装在 `src/services/http.ts`。

默认接口地址为：

```text
http://localhost:3002/api
```

如需切换环境，可以通过 `VITE_API_BASE_URL` 配置真实后端地址。

当前部分页面仍保留静态演示内容或未完全接入接口，主要用于补齐页面流程和交互入口。核心认证、发现、用户、活动、通知、小队等能力已按真实 API 调用方式组织在服务层中。

## 目录结构

```text
src/
  pages/                  主包页面：启动、认证、首页、发布、消息、我的
  subpkg-activity/         活动详情、搜索、地图、创建、报名、我的活动
  subpkg-activity-plus/    模板、草稿、签到、评价、活动总结
  subpkg-social/           好友、小队等社交页面
  subpkg-user/             资料编辑、公开主页、商家相关页面
  components/              通用 UI 组件
  services/                接口请求与业务服务
  stores/                  简单状态管理
  types/                   领域类型定义
  utils/                   路由、格式化等工具函数
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动默认平台开发模式 |
| `npm run dev:mp-weixin` | 启动微信小程序开发模式 |
| `npm run build` | 构建默认平台产物 |
| `npm run build:mp-weixin` | 构建微信小程序产物 |
| `npm run type-check` | 执行 TypeScript 类型检查 |

## 开发说明

- 页面路由配置在 `src/pages.json`。
- 小程序基础信息配置在 `src/manifest.json`。
- 微信开发者工具项目配置在 `project.config.json`。
- 个人本地配置放在 `project.private.config.json`，不建议提交团队仓库。
- 新增接口时优先在 `src/services` 中封装，再由页面或 store 调用。
- 新增页面时同步维护路由常量和页面配置，避免出现页面可访问但导航不可达的情况。

## 当前状态

项目已经完成移动端主要页面骨架和核心服务层整理，具备继续对接后端接口、完善交互细节和补齐业务闭环的基础。

后续重点包括：

- 补齐仍处于演示状态的页面接口接入
- 完善接口失败、空状态和登录过期处理
- 梳理发布、报名、签到、评价等完整业务流程
- 持续优化小程序端体验和页面一致性
