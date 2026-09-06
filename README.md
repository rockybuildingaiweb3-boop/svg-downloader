# SVG Downloader

> Verified Multi-Source Brand & Technology SVG Asset Registry — 面向设计师、前端工程师与 AI Agent 的品牌/科技 SVG 检索、验证、溯源与工程化导出工具。

## 项目定位

SVG Downloader 不只是 Logo 下载器，而是一个 **Canonical SVG Asset Registry**。核心数据模型：

```text
Brand Identity → Asset Family → Canonical Asset → Source Evidence
                                      ↓
                             SHA-256 + Verification
```

同一 identity 可以拥有来自多个来源、角色、场景和图形变体的资产。Resolver 根据可配置 Source Policy 选择 canonical asset，同时保留其他来源作为 provenance/evidence。

## 核心功能

### 多源资产

支持通过 adapter 聚合：

- **Simple Icons** — 品牌单色矢量
- **Devicon** — 开发者、框架与技术图标及变体
- **SVG Logos / Iconify** — 高保真、多色 SVG
- **Official Vendor** — 官方厂商资产
- **Wikimedia Commons** — 可追溯公共来源

> Source platform 与 official authorship 严格区分；Wikimedia 来源不会自动等同于官方认证。

### Canonical Resolution

```text
query
 → normalize
 → alias resolution
 → identity resolution
 → asset family discovery
 → role/context/variant matching
 → source policy
 → canonical asset selection
```

内置策略：

| Policy | 用途 | 优先级 |
|---|---|---|
| `brand` | 高保真品牌 | official → wikimedia → svg-logos → simple-icons → devicon |
| `technology` | 开发/框架 | devicon → svg-logos → official → wikimedia → simple-icons |
| `monochrome` | 单色 UI | simple-icons → devicon → svg-logos → official |
| `official` | 严格官方 | official → wikimedia |

策略与 identity override 位于 `config/source-policies.json`。

### Asset Family

资产按 identity 聚合，可包含：

`symbol` · `logo` · `wordmark` · `wordmark-horizontal` · `wordmark-stacked` · `app-icon` · `favicon` · `badge` · `mark`

并记录：source、source version、license、role、context、variant、SHA-256、verification status 等。

### 完整性与真实性

项目遵循 **Correctness > Completeness**：

- canonical SVG 保持原始内容，不重绘 path
- 不生成 AI 伪造 Logo
- 不用 regex 对 canonical vector 做 recolor / 改写
- 下载前计算并验证 SHA-256
- XML / SVG 可渲染性检查
- 找不到可信来源时标记 `unresolved`
- **禁止 fake SVG / placeholder SVG fallback**

Verification status：`verified` / `warning` / `conflict` / `unresolved` / `invalid`。

Trust state：`trusted` / `verified` / `community` / `unverified`。

### Web UI

支持：

- 搜索 title / slug / identity / source / role
- Category、Source、Verification、Role、Context、Variant、Trust State 筛选
- 高级筛选
- 分页渲染
- 单项选择 / 当前筛选全选
- Asset Inspector
- 在 Asset Family 中切换当前主资产
- 单项、批量 SVG ZIP 下载
- Engineering Bundle 导出
- Brand Pack / Asset Family 导出
- React / Vue 工程代码生成

### Export

**Pure SVG ZIP**：仅导出原始 canonical SVG。

**Engineering Bundle**：包含 registry、manifest 与 React/Vue 工程输出。

单个 Brand Pack 示例：

```text
brand-name/
├── symbol/
├── logo/
├── wordmark/
├── app-icon/
├── manifest.json
├── sources.json
└── README.md
```

导出 Asset Family 时基于 SHA-256 做内容去重，并在 metadata 中记录 `duplicateOf`。

## Registry 输出

同步后生成：

```text
generated/
├── catalog.json       # 完整 identity / asset catalog
├── manifest.json      # 版本、数量与注册表
├── conflicts.json     # 多源冲突与 policy 结果
├── sources.json       # provenance
├── audit-report.json  # doctor 审计报告
├── index.ts           # TypeScript registry / types
├── react.tsx          # React component
├── vue.ts             # Vue 3 component
└── README.md
```

`public/` 会同步 canonical SVG、`catalog.json`、`manifest.json`、`conflicts.json` 与 `sources.json`。

## 技术架构

```text
React UI
  ↓
Canonical Resolver
  ↓
Adapters: Official / Wikimedia / SVG Logos / Simple Icons / Devicon
  ↓
XML Validation + SHA-256
  ↓
RegistryGenerator
  ↓
public/icons + catalog + manifest + provenance + React/Vue output
```

## 技术栈

React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS 4 · Lucide React · Motion · JSZip · Fast XML Parser · Node.js ESM · Express · Simple Icons · Devicon · Iconify JSON Logos。

## 快速开始

```bash
npm install
npm run dev
```

开发服务器默认使用 `3000` 端口并监听 `0.0.0.0`。

生产构建：

```bash
npm run build
```

Build 会先验证 generated/public catalog 是否同步，再执行 Vite build。

## CLI

核心同步入口：`scripts/icon-sync.mjs`。

```bash
# 完整 catalog
npm run sync

# 主流集合
npm run sync -- --scope mainstream

# 所有发现 identity
npm run sync -- --all

# 指定 identity
npm run sync -- github react docker
npm run sync -- github,react,docker

# Source Policy
npm run sync -- --policy brand
npm run sync -- --policy technology
npm run sync -- --policy monochrome
npm run sync -- --policy official

# Dry Run
npm run sync -- --dry-run

# 搜索
npm run sync -- search github

# 验证 SVG
npm run verify

# 审计
npm run audit

# 健康检查
npm run doctor

# TypeScript 检查
npm run lint
```

`doctor` 会检查 source coverage、alias collision、catalog completeness、XML validity、renderability、SHA-256 mismatch、duplicate content、missing viewBox、stale files 与 catalog freshness。

## 配置

```text
config/aliases.json
config/collections.json
config/source-policies.json
```

例如：

```json
{
  "react": {
    "preferredSource": "devicon",
    "preferredVariant": "original"
  }
}
```

Resolver 会 normalize query → alias → 跨 adapter identity lookup，再根据 role/context/variant 和 policy 选择 canonical asset。

## 工程集成

同步后会生成：

```text
generated/index.ts
generated/react.tsx
generated/vue.ts
```

React registry component 的使用形式：

```tsx
import Icon from './generated/react';

<Icon name="github" size={24} />
```

`IconName` 由当前 registry 自动生成。

## 数据模型与规则

### Raw Canonical ≠ Derived

Canonical SVG 是不可变原始资产；React JSX、Vue SFC、monochrome 等均属于 derived representation，不能覆盖 canonical source。

### Source Evidence ≠ Canonical Asset

多个 source 可以共存。Resolver 只负责确定当前 policy 下的 canonical asset，不删除其他来源证据。

### Deterministic Resolution

相同输入、配置和 source versions 应产生一致结果。

### Manifest-driven Cleanup

同步会清理 catalog 未引用的 stale SVG，并识别历史 `-2.svg` 等 collision 文件。

### Unresolved 不可下载

`unresolved` identity / asset 不应进入正常下载流程；系统应显式报错，而不是生成替代品。

## 来源与许可证

第三方 SVG 的 license 属于各自资产，不等同于本仓库代码许可证。请以每个 asset 的 `sourceProvider`、`sourceUrl`、`sourceVersion`、`license` 和实际来源政策为准。生产环境重新分发 Logo / 商标前，请自行确认品牌商标政策与授权条件。

## Agent

AI Agent、代码 Agent 或自动化工具应先阅读 [`agent.md`](./agent.md)。该文件定义仓库架构、数据模型、修改边界、同步流程、验证规则、generated 文件策略以及提交前检查清单。

## 项目原则

> **可解析、可验证、可溯源、可重复生成、可直接用于工程。**

## License

代码仓库许可证与第三方资产许可证分开处理；以仓库 license 文件和各 asset metadata 为准。
