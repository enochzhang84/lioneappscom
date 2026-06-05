
## 目标
把 Lione Apps 官网升级为「CMS 驱动」：一次性搭好后台框架，之后所有产品、案例、首页文案、图片都通过后台管理（增/改/隐藏/排序），前台自动同步。

## 一、启用 Lovable Cloud
开启后获得：PostgreSQL 数据库 + 登录系统 + 文件存储（图片上传）。

## 二、数据库表设计（4 张核心表）

1. **site_settings**（键值对）
   - `key`(text 主键)、`value`(jsonb)
   - 存：首页主标题、副标题、按钮文字、联系邮箱、底部介绍等

2. **products**（产品）
   - `id`、`slug`(唯一)、`title`、`tag`、`short_desc`、`hero_image_url`
   - `long_content`(jsonb：含介绍、功能列表、截图、CTA 文案)
   - `sort_order`(int)、`is_visible`(bool)、`updated_at`

3. **cases**（项目案例）
   - `id`、`slug`、`title`、`tag`、`cover_image_url`、`summary`
   - `details`(jsonb：客户、亮点、功能模块、截图)
   - `sort_order`、`is_visible`

4. **media**（可选，图片库）
   - 通过 Storage Bucket `site-media` 存图，表中记录 `url`、`alt`、`uploaded_at`

权限：所有表对 `anon` 只读 visible 行；写操作仅限有 `admin` 角色的用户（独立 `user_roles` 表 + `has_role()` security definer 函数）。

## 三、登录与权限
- 邮箱+密码登录（`/auth` 页面）
- `user_roles` 表 + `app_role` 枚举（admin）
- 首位手动在数据库里指定 admin（之后可在后台分配）

## 四、后台框架（`/admin/*`，放在 `_authenticated` 下）
统一后台布局：左侧导航 + 右侧内容区。
- `/admin` 仪表盘（数量统计）
- `/admin/products` 产品列表：表格显示 标题/排序/可见性，行内切换隐藏、上下移动排序、编辑按钮
- `/admin/products/$id` 产品编辑：标题、slug、tag、简介、长内容（功能模块可增删条目）、封面图上传
- `/admin/cases` + `/admin/cases/$id` 同上
- `/admin/settings` 首页文案/联系信息编辑
- 图片上传统一走 Storage（拖拽上传 → 写入 `hero_image_url`）

通用组件：`AdminTable`、`SortableList`（上下箭头）、`VisibilityToggle`、`ImageUpload`、`JsonFieldArray`（动态列表字段）。

## 五、前台改造
- 首页 (`/`) ：Hero 文案读 `site_settings`，产品卡片读 `products` 表（按 `sort_order` 升序，仅 `is_visible`）
- 产品详情页 `/products/$slug`：单一动态路由替换现有 `/church` `/renovation` `/office` `/custom`（旧路由 301 到新地址保持兼容）
- 案例列表/详情 `/cases`、`/cases/$slug`：从 `cases` 表读取
- 联系页：邮箱等从 `site_settings`

所有前台数据通过 `createServerFn` + `supabaseAdmin`（只读 visible 行）实现 SSR 友好，TanStack Query 缓存。

## 六、初始数据
迁移时 seed 当前 4 个产品与 2 个案例的内容，保证启用后页面立刻有数据，不出现空白。

## 技术细节
- 所有公开读取走 server fn + admin client，仅返回 `is_visible=true` 行 + 安全字段
- 后台写入走带 `requireSupabaseAuth` + 角色检查的 server fn
- 图片：Storage public bucket `site-media`，前端拿公开 URL
- 表 GRANT：`anon SELECT` 只给 products/cases/site_settings 的 visible 数据（通过 RLS 控制），`authenticated` 全权，写入靠 has_role 限制

## 交付顺序
1. 启用 Cloud → 建表 + RLS + seed
2. 登录页 + admin 角色机制
3. 后台框架（settings → products → cases）
4. 前台改造（首页 → 产品动态路由 → 案例）

完成后您只需登录 `/admin` 就能管理所有网站内容。
