# Agent Guide — SVG Downloader

> 本文件是 AI Agent / Coding Agent / Automation Agent 操作本仓库时的行为契约。目标是让 Agent 在不破坏 canonical asset integrity、registry provenance 和生成链路的前提下完成开发、修复与数据更新。

## 1. Repository Mission

本仓库是 **Verified Multi-Source Brand & Technology SVG Asset Registry**，不是普通 SVG 下载器。

核心目标：

1. 将一个品牌 / 技术 identity 映射到完整 Asset Family。
2. 从多个 source adapter 中解析候选资产。
3. 根据 Source Policy 确定 canonical asset。
4. 保留 source evidence、版本、license 和 SHA-256 provenance。
5. 对 SVG 执行 XML / renderability / integrity validation。
6. 将 verified assets 输出到 `public/icons` 和 `generated/`。
7. 为设计、前端和自动化 Agent 提供可重复、可审计的资产结果。

**最高优先级原则：Correctness > Completeness。**

如果找不到可信 canonical asset，必须返回 / 保留 `unresolved`，禁止生成假 SVG、AI Logo、灰色占位图或未经验证的替代 path。

## 2. Architecture

```text
User Query
   ↓
normalizeQuery()
   ↓
alias resolution
   ↓
identity resolution
   ↓
Asset Family discovery
   ↓
role / context / variant matching
   ↓
Source Policy
   ↓
Canonical Asset
   ↓
XML + SVG validation
   ↓
SHA-256 integrity
   ↓
Registry / Manifest / Provenance
   ↓
public/icons + generated/
```

主要代码：

```text
src/App.tsx                 # Web UI state, search, filtering, selection, export
src/types.ts                # Identity / Asset / Source / verification types
src/utils/svgHelpers.ts     # SVG fetch, hash, download, derived export
src/data/                   # Curated catalog consumed by UI
scripts/icon-sync.mjs       # Canonical synchronization pipeline
scripts/icon-doctor.mjs     # Registry health / compliance audit
scripts/lib/resolver.mjs    # Identity + asset resolution engine
scripts/lib/validator.mjs   # SVG/XML validation + SHA-256
scripts/lib/registryGenerator.mjs
                             # Generated catalog / manifest / TS / React / Vue
scripts/lib/adapters/       # Source adapters
config/aliases.json         # Query aliases
config/collections.json     # Curated collections
config/source-policies.json # Resolution priorities / overrides
public/icons/               # Runtime canonical SVG assets
public/*.json               # Runtime registry metadata
generated/                  # Auto-generated registry artifacts
```

## 3. Data Model

不要把一个 icon 简化为一个 filename。完整关系是：

```text
BrandIdentity
 ├── canonicalAsset
 ├── assets[]
 └── sourceRecords[]

BrandAsset
 ├── sourceProvider
 ├── sourceVersion
 ├── role
 ├── context[]
 ├── graphicVariant
 ├── file
 ├── rawSha256
 ├── license
 ├── sourceUrl
 ├── verificationStatus
 └── trustState
```

关键概念：

- **Identity**：品牌 / 技术的逻辑身份。
- **Asset Family**：一个 identity 的所有可信资产候选。
- **Canonical Asset**：当前 policy 下选出的主资产。
- **Source Record**：来源证据，不等于 canonical asset。
- **Derived Asset**：由 canonical SVG 派生的 JSX、Vue、monochrome 等输出。

## 4. Source Providers

当前 adapter 生态：

- `official`
- `wikimedia`
- `iconify` / SVG Logos
- `simple-icons`
- `devicon`

不要在代码、UI 或文档中把 Wikimedia / Devicon / 社区 source 自动描述成「官方」。Source platform、trust state、official authorship 必须保持语义独立。

## 5. Source Policies

默认策略在 `config/source-policies.json`。

```text
brand:
  official → wikimedia → svg-logos → simple-icons → devicon

technology:
  devicon → svg-logos → official → wikimedia → simple-icons

monochrome:
  simple-icons → devicon → svg-logos → official

official:
  official → wikimedia
```

如果某 identity 已存在 `identityOverrides`，Agent 不应在 resolver 中硬编码新的特殊判断；优先修改配置。

## 6. Canonical Asset Integrity Rules

### MUST

- 保留原始 canonical SVG 内容。
- 使用 SHA-256 记录和检查 raw SVG integrity。
- 使用 XML / DOM validator 验证 SVG。
- 保留 source provider、version、license、source URL。
- 对 source collision 使用 deterministic policy。
- 新增 asset 时同步更新 registry / provenance。
- 在下载前拒绝 unresolved asset。

### MUST NOT

- 不生成 AI Logo 来补齐缺失资产。
- 不创建假 SVG fallback。
- 不用 `-2.svg`、`-3.svg` 等数字后缀掩盖 source collision。
- 不覆盖 canonical SVG 来生成 monochrome / recolored 版本。
- 不删除 source provenance 只保留最终文件。
- 不把 derived asset 当 canonical asset。
- 不仅因为 SVG XML 有效，就宣称品牌身份正确。

## 7. Naming / Collision Rules

Canonical file：

```text
<canonicalId>.svg
```

非 canonical family assets 使用可解释的 source / role / variant 信息，例如：

```text
<canonicalId>-<source>-<role>-<variant>.svg
```

禁止使用随机或数字后缀解决碰撞。

同步 pipeline 已包含 stale asset cleanup。修改 resolver 时必须确保 active asset file set 与 cleanup 逻辑保持一致。

## 8. Generated Files

以下内容原则上视为 generated output：

```text
generated/catalog.json
generated/manifest.json
generated/conflicts.json
generated/sources.json
generated/index.ts
generated/react.tsx
generated/vue.ts
generated/README.md
generated/audit-report.json
public/catalog.json
public/manifest.json
public/conflicts.json
public/sources.json
public/icons/*.svg
src/data/catalog.json
```

如果变化来自 source data / resolver / config，优先修改 source-of-truth，再运行 sync，而不是手工编辑 generated 文件。

例外：如果任务明确要求修复 generated artifact，应先确认生成链路是否也需要修复，避免下一次 sync 覆盖修改。

## 9. Safe Change Workflow

### A. 修改 UI

通常修改：

```text
src/App.tsx
src/components/*
src/utils/*
src/types.ts
```

不要为了 UI 行为修改 registry 的 canonical 数据，除非 UI 本身确实改变了数据语义。

### B. 修改数据 / source

通常流程：

```bash
npm run sync -- <identity>
npm run verify
npm run doctor
npm run lint
npm run build
```

如果修改的是全局 source policy：

```bash
npm run sync -- --policy <policy>
npm run doctor
npm run build
```

### C. 修改 resolver

先理解：

```text
normalize → alias → identity → family → criteria → policy → canonical
```

避免在 `resolveAsset()` 中增加与配置重复的 brand-specific hardcode。

## 10. CLI Contract

```bash
npm install
npm run dev
npm run build
npm run sync
npm run sync -- --scope mainstream
npm run sync -- --all
npm run sync -- github react docker
npm run sync -- --dry-run
npm run sync -- search github
npm run verify
npm run audit
npm run doctor
npm run lint
```

### Build

`npm run build` 包含 catalog freshness check。若提示 generated catalog stale，先运行 sync。

### Verify

用于检查 `public/icons` 中 canonical SVG 的完整性。

### Doctor

用于综合检查：

- source coverage
- alias collision
- catalog completeness
- XML validity
- renderability
- missing viewBox
- SHA-256 mismatch
- duplicate content
- stale files
- UI catalog freshness

### Audit

用于生成 registry audit information。

## 11. Verification Semantics

不要混淆这些字段：

```text
xmlValid
svgRenderable
sourceTrusted
canonicalResolved
integrityVerified
variantVerified
verificationStatus
trustState
```

推荐解释：

| 字段 | 意义 |
|---|---|
| `xmlValid` | XML/SVG 文档结构有效 |
| `svgRenderable` | SVG 可正常渲染 |
| `sourceTrusted` | source 在当前 trust model 下可信 |
| `canonicalResolved` | 已成功找到 canonical asset |
| `integrityVerified` | 内容 hash 与记录一致 |
| `variantVerified` | variant 信息通过验证 |
| `verificationStatus` | 资产整体状态 |
| `trustState` | 来源 / 资产信任级别 |

`xmlValid=true` **不代表**「这是正确的官方 Logo」。

## 12. Derived Asset Rules

`src/utils/svgHelpers.ts` 已明确区分 raw canonical 和 derived output。

允许：

- React JSX attribute mapping
- Vue SFC 包装
- 用户明确要求的 monochrome derived representation
- Engineering Bundle

禁止：

- 修改 raw canonical 文件来满足 derived presentation
- 将 derived SHA 覆盖 raw SHA
- 用 derived path 伪装 source vector

## 13. Batch Export Rules

正常下载流程只能包含 verified / resolvable assets。

遇到：

```text
verificationStatus === 'unresolved'
```

应停止该 asset 的下载并给出明确错误，而不是继续生成 placeholder。

Brand Pack / Asset Family 导出应包含 provenance metadata；如果相同 SHA 的文件重复出现，应进行内容去重并记录 `duplicateOf`。

## 14. Alias / Collection Changes

修改 `config/aliases.json` 时：

- 保持 alias → canonical identity 一对多冲突可检测。
- 不要通过 alias 创建重复 identity。
- 修改后运行 `npm run doctor`。

修改 `config/collections.json` 时：

- 不要把 unresolved identity 当成 verified asset。
- 明确区分 mainstream、category 和 custom scope。
- 更新后运行 sync + doctor。

## 15. Testing / Validation Checklist

提交前至少执行与改动范围相匹配的检查：

```bash
npm run lint
npm run verify
npm run doctor
npm run build
```

涉及 source / resolver / config 时，优先增加：

```bash
npm run sync -- --dry-run
```

或针对具体 identity：

```bash
npm run sync -- <identity>
```

## 16. PR / Commit Checklist

Agent 完成代码修改前应确认：

- [ ] 是否修改了正确的 source-of-truth？
- [ ] 是否误改 generated 文件？
- [ ] 是否破坏 canonical SVG 原始内容？
- [ ] 是否引入 fake / placeholder SVG？
- [ ] 是否保留 source provenance？
- [ ] 是否保持 deterministic resolution？
- [ ] 是否存在新的 source collision？
- [ ] 是否需要更新 aliases / collections / source policy？
- [ ] 是否需要重新运行 sync？
- [ ] 是否运行 lint / verify / doctor / build？
- [ ] 是否在文档中正确描述第三方 license？

## 17. Debugging Priorities

遇到资产问题时按顺序检查：

```text
1. Query normalization
2. Alias mapping
3. Identity existence
4. Adapter availability
5. Asset family discovery
6. Source policy
7. Role/context/variant criteria
8. Raw SVG fetch
9. XML validation
10. SHA-256 integrity
11. Generated catalog freshness
12. Public asset path
```

不要直接在 UI 层修复 resolver 或数据问题。

## 18. Agent Decision Rules

### 用户说「加一个 Logo」

先判断这是：

- 新 identity
- 新 source asset
- 新 variant
- 新 alias
- 新 collection entry

然后修改对应 source-of-truth，运行 sync / validation。

### 用户说「这个 Logo 不对」

不要直接替换 SVG。先检查：

1. identity 是否正确。
2. source candidates 有哪些。
3. 当前 policy 是什么。
4. 是否已有更适合的 role / variant。
5. 是否应增加 `identityOverrides`。
6. source provenance 和 license 是否正确。

### 用户说「找不到 Logo」

不要生成 Logo。返回 `unresolved` 或增加可信 source adapter / source record。

### 用户说「把所有 Logo 变成黑色」

不要修改 canonical assets。应生成 derived monochrome representation，并明确标记 `isDerived=true`。

## 19. Do Not Over-Engineer

除非任务明确要求，不要：

- 重写整个 resolver
- 更换 source provider
- 引入新的 UI framework
- 修改现有 data model 的语义
- 删除 provenance 字段
- 用缓存掩盖 source resolution failure
- 修改 license metadata 以「统一」许可证

优先做最小、可验证、可回滚的修改。

## 20. Final Principle

任何 Agent 对本仓库的最终判断都应遵循：

> **真实来源优先，canonical integrity 优先，provenance 不丢失，resolution 必须可解释，失败必须显式，而不是伪造成功。**
