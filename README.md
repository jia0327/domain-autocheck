# 🌍 Domain-Autocheck

> 基于 [Cloudflare Workers](https://workers.cloudflare.com/) 的域名到期监控系统。  
> 本仓库为独立维护分支，源自社区版 Domain-AutoCheck，已大量重构并新增功能，**不再与上游同步维护**。  
> 仓库地址：[cf-fork-div/domain-autocheck](https://github.com/cf-fork-div/domain-autocheck)

<details>
    <summary>更新日志</summary>

    2026-06-28  
    1. 新增 **20+ 推送渠道**（Bark / Server酱 / 钉钉 / 飞书 / ntfy / Webhook 等），系统设置中单选一种通知方式  
    2. 新增 **厂商模板** 系统：可编辑注册商名称、官网、后缀、续费链接、续费窗口、默认提醒天数、WHOIS 类型及 DNSHE 凭据  
    3. 新增 **Cloudflare 托管识别**：根据 NS 判断并在卡片标题展示「CF 已托管」徽章  
    4. 支持 **批量 NS 同步**、**DNSHE 账号域名一键导入**  
    5. 修复 inline 脚本在 HTML 模板中的转义问题（推送渠道下拉、厂商列表加载）  

    2026-06（此前）  
    1. 新增 DNSHE 托管子域名 WHOIS 查询（de5.net / ccwu.cc / bbroot.com 等，需配置 API Key）  
    2. 接入 Stackryze 托管子域名（indevs.in / sryze.cc / ryzedns.org / nx.kg）  
    3. WHOIS 查询后按注册厂商 **自动创建并选中分类**  
    4. 系统设置支持按服务商配置默认续费链接与续费开放窗口  

    2025-12-14  
    1. 系统设置：默认展开卡片、进度条样式、卡片布局（3/4 列）  
    2. 亮色 / 暗色主题切换  
    3. 二级域名自动 WHOIS：`pp.ua`、`qzz.io`、`dpdns.org`、`xx.kg`、`us.kg`、`eu.cc` 等  
    4. 分类筛选、注册账号字段、单域名自定义提前通知天数  

</details>

## ✨ 一句话介绍

部署在 Cloudflare Workers 的域名到期监控，支持 **20+ 推送渠道**、多厂商 WHOIS 自动填充、厂商模板与续费窗口、Cloudflare NS 识别及 DNSHE 批量导入。

## 🚀 项目亮点

* Cloudflare Workers 部署，零服务器运维；数据存于 KV，更新代码不丢域名
* **20+ 到期通知渠道**（单选启用），密钥支持界面配置或 Worker 环境变量
* **厂商模板**：内置 NIC.UA / Gname / DigitalPlat / Stackryze / DNSHE，可增删自定义厂商
* 一级域名免费 RDAP 查询；多种二级 / 托管子域名 TCP WHOIS / RDAP / API 查询
* WHOIS 后自动填充注册商、日期、续费链接；按厂商自动归类
* **续费开放窗口**：按厂商限制「到期前 N 天内才可续费」的提示与 UI
* **Cloudflare 托管**：NS 指向 Cloudflare 时卡片显示徽章（仅以 NS 判断，避免误判）
* 批量同步到期日、批量同步 NS；DNSHE 账号域名预览与批量导入
* 分类管理、价格记录、自定义标签与备注颜色、自定义续费链接
* 登录 HMAC 会话、失败频次限制、CSRF 与 XSS 防护
* 亮色 / 暗色主题；卡片折叠 / 展开；进度条或圆环样式

## 📣 通知渠道

在 **系统设置 → 通知设置** 中选择 **一种** 通知方式（同时仅启用一个渠道）：

| 类型 | 渠道 |
|:-----|:-----|
| 常用 | Telegram、Bark、Server酱、PushPlus、PushDeer |
| 企业协作 | 钉钉机器人、企业微信机器人、企业微信应用、飞书机器人 |
| 自建 / 通用 | ntfy、Gotify、自定义 Webhook、Synology Chat |
| 微信生态 | WxPusher、Qmsg酱、微加机器人、智能微秘书 |
| 其它 | PushMe、iGot、Go-cqhttp、Chronocat |

通知内容支持 Cron 定时触发（UTC），可配置提前 N 天开始提醒；单域名可覆盖全局提前天数。

## 🏭 厂商模板

**系统设置 → 厂商模板** 中可管理各注册商：

| 字段 | 说明 |
|:-----|:-----|
| 厂商名称 / 官网 | 展示与分类用 |
| 支持后缀 | 每行一个，如 `.pp.ua`；用于域名校验与 WHOIS 路由 |
| 默认续费链接 | 添加域名时自动填充 |
| 续费开放窗口 | 到期前 N 天内才视为「可续费」（0 = 不限制） |
| 默认提醒时间 | 新域名默认提前通知天数 |
| WHOIS 类型 | pp.ua / eu.cc / DigitalPlat / Stackryze / DNSHE / RDAP |
| DNSHE 凭据 | 可在模板中填写 API Key/Secret，或使用环境变量 |

内置厂商：NIC.UA、Gname、DigitalPlat、Stackryze、DNSHE（内置 WHOIS 类型不可改，可改链接与窗口）。

## ✅ 二级域名 / 托管子域名自动查询

| 后缀 / 服务商 | 注册网址 | 备注 |
|:---------|:---------|:-----|
| `pp.ua` | https://nic.ua | 无需额外配置 |
| `us.kg` / `xx.kg` / `qzz.io` / `dpdns.org` | https://domain.digitalplat.org | DigitalPlat |
| `eu.cc` | https://www.gname.com | 续费窗口默认 90 天 |
| `indevs.in` / `sryze.cc` / `ryzedns.org` / `nx.kg` | https://domain.stackryze.com | Stackryze |
| `de5.net` / `us.ci` / `cc.cd` / `bot.cd` / `ccwu.cc` / `bbroot.com` / `bbroott.com` / `cn.mt` / `onlydev.cc` / `ddns.ge` | https://my.dnshe.com | DNSHE，需 API Key |

> DNSHE 使用 Domain Hub **Access Token**（`X-API-Key` + `X-API-Secret`），勿将浏览器 Cookie 填入 Worker。  
> 支持从 DNSHE 账号 **预览并批量导入** 子域名到监控列表。

## 🧩 主要功能

* 域名 CRUD、到期日 / 注册日、续费周期与价格
* 分类筛选与管理（排序、移动、删除）
* 单域名 / 批量同步 WHOIS 到期日
* 批量 NS 检测与 Cloudflare 托管徽章
* 注册账号、自定义备注与颜色标签
* 列表排序（后缀、到期日、剩余天数等）
* 视图：全部折叠 / 全部展开 / 自动折叠
* 首次部署 KV 检测引导页（`/api/check-setup`）

## 💻 界面展示

暗色与亮色主题示例：

| 暗色主题 | 亮色主题 |
|:--:|:--:|
| ![暗色主题](https://github.com/user-attachments/assets/1f683ac4-6380-4201-b3a9-f4de9d5ed4b9) | ![亮色主题](https://github.com/user-attachments/assets/f6436078-8a0e-4a93-95e7-4d62e0865838) |

## 📌 显示逻辑

### 卡头标签

| 判定条件 | 标签状态 |
|:-----------------|:-----------|
| 剩余天数小于 1 天 | ❌ 已过期 |
| 剩余天数 1–20 天 | 📢 即将过期 |
| 剩余天数大于 20 天 | ✅ 正常 |

### 卡片进度条

| 判定条件 | 进度条状态 |
|:--------------------------|:-----------|
| 剩余天数小于周期的 10% | 🔴 已过期 |
| 剩余天数为周期的 10%–30% | 🟡 即将过期 |
| 剩余天数 ≥ 周期的 30% | 🟢 正常 |

## 🔗 部署到 Cloudflare（推荐）

### 第一步：Fork 或 Clone 本仓库

Fork：[cf-fork-div/domain-autocheck](https://github.com/cf-fork-div/domain-autocheck)

### 第二步：连接 Cloudflare Workers

[![Deploy with Cloudflare](https://img.shields.io/badge/Cloudflare-部署到_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create)

选择 GitHub 仓库 `cf-fork-div/domain-autocheck` 部署。Cloudflare 会自动创建并绑定 `DOMAIN_MONITOR` KV。

### 第三步：环境变量

在 Workers → Settings → Variables and Secrets 中配置（见下表）。通知与 DNSHE 也可在 **系统设置** 界面填写。

### 第四步：定时通知（可选）

Workers → Triggers → Cron Triggers 添加定时任务。

> Cron 使用 **UTC**。例如 `0 0 * * *` 为北京时间 08:00。

---

## 🚀 手动部署

1. 创建 Workers，将 `src/index.js` **整文件粘贴**部署（本项目为单文件 Worker）
2. 创建 KV 命名空间并绑定，变量名 **`DOMAIN_MONITOR`**
3. 配置环境变量与 Cron（可选）
4. 绑定自定义域名（可选）

```bash
git clone https://github.com/cf-fork-div/domain-autocheck.git
cd domain-autocheck
npm install
npm run deploy   # 需已配置 wrangler 与 KV
npm test         # 运行单元测试
```

## ⚙️ 环境变量

> 优先级：Cloudflare 环境变量 > 界面配置 > 代码默认值

| 名称 | 示例 | 必填 | 备注 |
|:------------------|:-------------------------------------------------------------------------------|:----:|:-----------------------------------------|
| TOKEN | 自定义强密码 | ✅ | 登录密码，未设置时默认 `domain` |
| DOMAIN_MONITOR | （KV 绑定） | ✅ | 绑定名固定 |
| DNSHE_API_KEY | [DNSHE Domain Hub](https://my.dnshe.com/index.php?m=domain_hub) 生成 | ❌ | DNSHE WHOIS / 导入 |
| DNSHE_API_SECRET | 同上 | ❌ | 与 Key 成对 |
| TG_TOKEN | [@BotFather](https://t.me/BotFather) | ❌ | 可在界面配置 |
| TG_ID | [@userinfobot](https://t.me/userinfobot) | ❌ | 可在界面配置 |
| SITE_NAME | 我的域名监控 | ❌ | 站点标题 |
| LOGO_URL | https://example.com/logo.png | ❌ | Logo |
| BACKGROUND_URL | https://example.com/bg.jpg | ❌ | 背景图 |
| MOBILE_BACKGROUND_URL | 同上 | ❌ | 移动端背景 |

各推送渠道（`BARK_PUSH`、`PUSH_KEY`、`DD_BOT_TOKEN` 等）也可通过环境变量配置，详见系统设置中的占位提示。

## ♻️ 代码更新

域名与配置保存在 KV 中，更新 Worker 代码 **不会丢失数据**（保持 KV 绑定不变）。

* **Git 部署**：推送至本仓库 main，Cloudflare 自动构建
* **手动粘贴**：复制新版 `src/index.js` 全文到 Dashboard；若曾在代码里硬编码变量请先备份

## 📜 与上游的关系

本项目最初 fork 自社区 [Domain-AutoCheck](https://github.com/jy02739244/Domain-AutoCheck) 生态，当前由 [cf-fork-div/domain-autocheck](https://github.com/cf-fork-div/domain-autocheck) **独立演进**，功能与代码结构已显著不同，请勿依赖上游 Sync fork。

## ⭐ Star

![Star History](https://api.star-history.com/svg?repos=cf-fork-div/domain-autocheck&type=Date)
