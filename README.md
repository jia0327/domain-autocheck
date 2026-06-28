# 🌍 Domain-Autocheck

<details>
    <summary>更新日志</summary>

    2026-06-28  
    1. 新增 DNSHE 托管子域名 WHOIS 查询（de5.net / ccwu.cc / bbroot.com 等，需配置 API Key）  
    2. 系统设置支持 DNSHE 默认续费链接与 180 天续费开放窗口  

    2026-06（此前）  
    1. 接入 Stackryze 托管子域名（indevs.in / sryze.cc / ryzedns.org / nx.kg）  
    2. 系统设置新增按服务商配置默认续费链接与续费开放窗口  
    3. WHOIS 查询后按注册厂商自动创建并选中分类  

    2025-12-14  
    1. 系统设置新增默认展开卡片、进度条、卡片布局设置  
    2. 新增亮色和暗色主题切换  
    3. 新增 `pp.ua`、`qzz.io`、`dpdns.org`、`xx.kg`、`us.kg`、`eu.cc` 6 个二级域名自动查询（自动填写注册厂商、注册日期、到期日期、续期链接，默认续期周期 1 年）  
    4. 列表新增分类下拉框过滤，添加域名增加注册账号属性  
</details>

> 除了一级域名（免费 RDAP）外，还支持多种二级/托管子域名：点击 WHOIS 查询后，注册商、注册日期、到期日期、续费链接等会自动填充（DNSHE 需在 Worker 环境变量中配置 `DNSHE_API_KEY` / `DNSHE_API_SECRET`）。

## ✨一句话介绍
部署在 Cloudflare Workers 的轻量级域名到期监控系统，支持 Telegram 通知与自动 WHOIS 填充。

## 🚀项目亮点
* Cloudflare Workers 部署，零服务器运维
* Cloudflare KV 持久化存储
* 支持 Telegram 到期提醒
* 支持一级域名 WHOIS 自动查询（基于免费 RDAP，无需 API Key）
* 支持多种二级/托管子域名自动查询（见下表）
* 按注册商自动分类、可配置各服务商默认续费链接与续费开放窗口

## ✅二级域名 / 托管子域名自动查询
支持以下后缀自动识别注册商、注册日期、到期日期、续期链接，并默认续期周期 1 年：

| 后缀 / 服务商 | 注册网址 | 备注 |
|:---------|:---------|:-----|
| `pp.ua` | https://nic.ua | 无需额外配置 |
| `us.kg` / `xx.kg` / `qzz.io` / `dpdns.org` | https://domain.digitalplat.org | DigitalPlat |
| `eu.cc` | https://www.gname.com | 免费续费窗口默认 90 天 |
| `indevs.in` / `sryze.cc` / `ryzedns.org` / `nx.kg` | https://domain.stackryze.com | Stackryze，无需 API Key |
| `de5.net` / `us.ci` / `cc.cd` / `bot.cd` / `ccwu.cc` / `bbroot.com` / `bbroott.com` / `cn.mt` / `onlydev.cc` | https://my.dnshe.com | DNSHE，需配置 API Key（见环境变量） |

> DNSHE 的 WHOIS 接口与控制台 Domain Hub 相同，使用 **Access Token**（`X-API-Key` + `X-API-Secret`），**不要**把浏览器登录 Cookie 填进 Worker。

## 📌项目说明
本项目主要是和 AI 沟通创作而成，小伙伴可自行进行完善或魔改。

## 🎯适用场景
* 主要监控域名的到期情况
* 适合白嫖域名或需要定期续期的域名（如 `dpdns.org` 等）

## 🧩主要功能
* 日期监控
* 价格记录
* 注册商记录
* 自定义标签
* 自定义续费链接
* Telegram 提前通知

## 💻界面展示
暗色与亮色主题示例：

| 暗色主题 | 亮色主题 |
|:--:|:--:|
| ![暗色主题](https://github.com/user-attachments/assets/1f683ac4-6380-4201-b3a9-f4de9d5ed4b9) | ![亮色主题](https://github.com/user-attachments/assets/f6436078-8a0e-4a93-95e7-4d62e0865838) |

## 📌显示逻辑
### 卡头标签显示逻辑
| 判定条件         | 标签状态   |
|:-----------------|:-----------|
| 剩余天数小于1天  | ❌已过期    |
| 剩余天数为1-20天 | 📢即将过期 |
| 剩余天数大于20天 | ✅正常      |

### 卡片进度条显示逻辑
| 判定条件                  | 进度条状态 |
|:--------------------------|:-----------|
| 剩余天数小于周期的10%     | 🔴已过期   |
| 剩余天数是周期的10%-30%   | 🟡即将过期 |
| 剩余天数大于等于周期的30% | 🟢正常     |

## 🔗 Fork 部署（推荐）

Fork 部署可以保持与上游仓库的关联，方便后续通过 **Sync fork** 同步更新。

### 第一步：Fork 本仓库

点击右上角 **Fork** 按钮，将项目复制到你的 GitHub 账号。

### 第二步：部署到 Cloudflare

[![Deploy with Cloudflare](https://img.shields.io/badge/Cloudflare-部署到_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create)

点击上方按钮，选择 **Continue with GitHub**，然后选择你 Fork 后的仓库进行部署。  
部署时 Cloudflare 会自动创建并绑定 `DOMAIN_MONITOR` KV 命名空间。

### 第三步：配置环境变量

部署完成后，在 Cloudflare Dashboard → Workers → 你的服务 → Settings → Variables and Secrets 中配置环境变量（见下方环境变量表）。

### 第四步：配置定时通知（可选）

在 Cloudflare Dashboard → Workers → 你的服务 → Triggers → Cron Triggers 中添加定时触发器。

> Cloudflare `Cron` 使用 UTC 时间，与北京时间相差 8 小时。  
> 例如设置为 00:00，则北京时间 08:00 进行通知。

### 同步更新

上游仓库更新后，在你 Fork 的仓库页面点击 **Sync fork** 同步最新代码，Cloudflare 会自动重新构建部署。

---

## 🚀手动部署
1. 创建 `Workers` 服务，粘贴代码
2. 创建一个 `KV` 命名空间（名字可自定义）
3. 绑定 `KV`，变量名称：`DOMAIN_MONITOR`（注意大写）
4. 绑定自定义域名（可选）
5. 配置环境变量（见下表）
6. 配置定时通知（`Cron` 触发器）

> Cloudflare `Cron` 使用 UTC 时间，与北京时间相差 8 小时。  
> 例如设置为 00:00，则北京时间 08:00 进行通知。

## ⚙️环境变量
> 优先级：Cloudflare 环境变量 > 代码中的变量 > 默认值

| 名称              | 示例                                                                           | 必填 | 备注                                     |
|:------------------|:-------------------------------------------------------------------------------|:----:|:-----------------------------------------|
| TOKEN             | 默认是 `domain`                                                                |  ✅️  | 登录密码，建议自定义，不填则默认 `domain` |
| DOMAIN_MONITOR    | （KV 绑定）                                                                    |  ✅️  | Workers 绑定 KV 命名空间，变量名固定     |
| DNSHE_API_KEY     | 在 [DNSHE Domain Hub](https://my.dnshe.com/index.php?m=domain_hub) 生成       |  ❌️  | 查询 DNSHE 托管子域名时必填              |
| DNSHE_API_SECRET  | 同上                                                                           |  ❌️  | 与 `DNSHE_API_KEY` 成对使用              |
| TG_TOKEN          | Telegram 找 [@BotFather](https://t.me/BotFather) 获取                           |  ❌️  | 可在界面后端配置                         |
| TG_ID             | Telegram 找 [@userinfobot](https://t.me/userinfobot) 获取，或群机器人也可       |  ❌️  | 可在界面后端配置                         |
| SITE_NAME         | 默认为域名到期监控                                                             |  ❌️  | 不填则默认“域名到期监控”                 |
| LOGO_URL          | https://123abc.com/logo.svg                                                    |  ❌️  | 网站 logo，有需要可自行设置             |
| BACKGROUND_URL    | https://123abc.com/img.jpg                                                     |  ❌️  | 背景图，有需要可自行设置                 |

## ♻️代码更新方式
功能基本稳定，通常只有一些体验类小修复，并不影响整体使用。  
如需更新，只要重新复制粘贴代码即可；域名数据存储在 `KV` 中，保持 `KV` 不变不会丢失数据。  
> 🚨如果你在代码中手动填写了变量，更新前请先备份这些值。

## ⭐ Star 星星走起
![Star History](https://api.star-history.com/svg?repos=jy02739244/Domain-AutoCheck&type=Date)
