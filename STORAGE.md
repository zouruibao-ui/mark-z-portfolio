# 持久化存储配置指南 (Production Storage Setup)

> **⚠️ 重要**：您的网站已在 Vercel 上运行，但**尚未配置持久化数据库**！
> 这意味着所有内容管理操作（新增/编辑/删除作品、访问控制、布局设置）都会在服务器冷启动时**丢失**。
>
> Personal Center 首页会持续显示黄色警告横幅，直到您完成本指南。

## 选项 A：Vercel KV（推荐 — 最简单）

Vercel KV 基于 Upstash Redis，是 Vercel 原生的键值存储，零配置环境变量，直接集成。

### 步骤

1. **打开 Vercel Dashboard** → 进入你的项目 → **Storage** 标签
2. 点击 **Create Database** → 选择 **KV** → 选择 **Hobby** 计划（免费）
3. 创建完成后，Vercel 会自动注入以下环境变量到你的项目：
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`
4. **重新部署**（Vercel 会自动触发，或手动 `vercel redeploy`）

完成后，`src/lib/db.ts` 会自动检测到 `KV_URL` / `KV_REST_API_URL` / `KV_REST_API_TOKEN` 并持久化数据。

## 选项 B：Upstash Redis（独立云服务）

1. 前往 [upstash.com](https://upstash.com) 注册
2. 创建数据库 → 选择 **Redis**（免费层 256MB）
3. 复制 REST 连接信息：
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. 在 Vercel 项目 **Settings → Environment Variables** 中添加以上两个变量
5. 重新部署

## 验证是否生效

部署完成后，访问：

```
https://mark-z-portfolio.vercel.app/api/storage/health
```

期望返回：

```json
{
  "hasUpstash": true,
  "storageMode": "upstash-redis",
  "durable": true
}
```

如果 `storageMode` 仍是 `EPHEMERAL-MEMORY-ONLY`，说明环境变量未生效，请检查 Vercel 项目环境变量设置。

## 关于本地开发

本地开发（`npm run dev`）默认使用 `.data/db.json` 文件持久化数据，无需任何配置即可正常工作。