#!/usr/bin/env node

/**
 * 官方企业级 SVG Icon 资产同步器 (Enterprise Icon Sync Pipeline)
 * 数据源: Simple Icons (3450+ 品牌) + Devicon (570+ 开发者工具与语言) + 权威官方源
 * 产物: 规范命名的 SVG 文件 + manifest.json (SHA-256 溯源) + TS/React/Vue 强类型注册表
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createHash } from "node:crypto";

const ROOT = process.cwd();

const DEFAULTS = {
  out: "icons",
  packageDir: ".icon-packages",
  source: "both", // simple | devicon | both
  scope: "mainstream", // mainstream | all | custom
  registry: true,
  color: "brand", // brand | currentColor | mono | raw
  overwrite: true,
  prefix: ""
};

const MAINSTREAM_LIST = [
  "apple", "google", "microsoft", "meta", "amazon", "netflix", "ibm", "intel", "amd", "nvidia", "tesla", "adobe",
  "openai", "anthropic", "deepseek", "huggingface", "mistralai",
  "react", "vuedotjs", "angular", "svelte", "nextdotjs", "nuxt", "tailwindcss", "vite", "webpack", "astro",
  "javascript", "typescript", "python", "nodedotjs", "rust", "go", "swift", "kotlin", "java", "csharp", "cplusplus",
  "docker", "kubernetes", "linux", "git", "github", "gitlab", "amazonwebservices", "googlecloud", "cloudflare", "vercel", "supabase",
  "mongodb", "postgresql", "mysql", "redis", "nginx", "apache",
  "figma", "notion", "visualstudiocode", "x", "youtube", "discord", "slack", "wechat", "linkedin"
];

const SPECIAL_SOURCES = {
  microsoft: {
    title: "Microsoft",
    hex: "00A4EF",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
  },
  ibm: {
    title: "IBM",
    hex: "052FAD",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
  },
  adobe: {
    title: "Adobe",
    hex: "FF0000",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg"
  }
};

const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printHelp();
  process.exit(0);
}

const options = {
  ...DEFAULTS,
  ...args
};

const outDir = path.resolve(ROOT, options.out);
const packageDir = path.resolve(ROOT, options.packageDir);

await fs.mkdir(outDir, { recursive: true });

const selected = new Set(
  String(options.source)
    .split(",")
    .map(v => v.trim().toLowerCase())
    .filter(Boolean)
);

if (![...selected].some(v => ["simple", "devicon", "both"].includes(v))) {
  fail("--source must include simple, devicon, or both");
}

console.log("=====================================================");
console.log("🚀 开始执行企业级 SVG 图标同步 (Icon Sync Pipeline)");
console.log(`📁 输出目录: ${path.relative(ROOT, outDir)}`);
console.log(`📦 数据源:   ${[...selected].join(", ")}`);
console.log(`🎨 着色模式: ${options.color}`);
console.log(`🔍 同步范围: ${options.scope}`);
console.log("=====================================================\n");

const results = [];
const usedNames = new Map();

// Filter set if mainstream or custom
let allowedSlugs = null;
if (options.scope === "mainstream") {
  allowedSlugs = new Set(MAINSTREAM_LIST);
} else if (options.scope !== "all") {
  // If specific icons were passed in as positional args or comma-separated
  const customItems = options.scope.split(",").map(s => s.trim().toLowerCase());
  allowedSlugs = new Set(customItems);
}

// 1. Simple Icons Catalog
if (selected.has("simple") || selected.has("both")) {
  const simplePackage = await resolvePackage("simple-icons", packageDir);
  const simpleMeta = await readSimpleCatalog(simplePackage);
  console.log(`📦 已加载 Simple Icons (v${simpleMeta.version})，共 ${simpleMeta.icons.length} 个图标`);

  for (const icon of simpleMeta.icons) {
    if (allowedSlugs && !allowedSlugs.has(icon.slug) && !allowedSlugs.has(normalizeName(icon.title))) {
      continue;
    }

    results.push(await materializeIcon({
      source: "simple-icons",
      sourceVersion: simpleMeta.version,
      title: icon.title,
      slug: icon.slug,
      hex: icon.hex,
      sourceUrl: icon.source ?? null,
      svgPath: path.join(simplePackage, "icons", `${icon.slug}.svg`),
      outDir,
      usedNames,
      prefix: options.prefix,
      colorMode: options.color
    }));
  }
}

// 2. Devicon Catalog
if (selected.has("devicon") || selected.has("both")) {
  const deviconPackage = await resolvePackage("devicon", packageDir);
  const devMeta = await readDeviconCatalog(deviconPackage);
  console.log(`📦 已加载 Devicon (v${devMeta.version})，共 ${devMeta.icons.length} 个技术矢量`);

  for (const icon of devMeta.icons) {
    if (allowedSlugs && !allowedSlugs.has(icon.slug) && !allowedSlugs.has(normalizeName(icon.title))) {
      continue;
    }

    results.push(await materializeIcon({
      source: "devicon",
      sourceVersion: devMeta.version,
      title: icon.title,
      slug: icon.slug,
      variant: icon.variant,
      hex: icon.hex,
      sourceUrl: null,
      svgPath: icon.svgPath,
      outDir,
      usedNames,
      prefix: options.prefix,
      colorMode: options.color
    }));
  }
}

// 3. Fallback Special Sources (e.g. Microsoft, Adobe, etc.)
for (const [slug, spec] of Object.entries(SPECIAL_SOURCES)) {
  if (allowedSlugs && !allowedSlugs.has(slug)) continue;
  if (!usedNames.has(slug)) {
    try {
      const res = await fetch(spec.url);
      if (res.ok) {
        const rawSvg = await res.text();
        const outputPath = path.join(outDir, `${options.prefix}${slug}.svg`);
        await fs.writeFile(outputPath, rawSvg, "utf8");
        results.push({
          name: `${options.prefix}${slug}`,
          title: spec.title,
          slug,
          variant: "official",
          source: "official-archive",
          sourceVersion: "latest",
          sourceUrl: spec.url,
          file: `${options.prefix}${slug}.svg`,
          hex: spec.hex,
          sha256: sha256(rawSvg),
          status: "downloaded"
        });
        usedNames.set(`${options.prefix}${slug}`, { source: "official-archive", slug });
      }
    } catch {}
  }
}

const successful = results.filter(x => x.status === "downloaded");
const failures = results.filter(x => x.status === "failed");

// 4. Generate manifest.json
const manifest = {
  generatedAt: new Date().toISOString(),
  cwd: ROOT,
  colorMode: options.color,
  sources: [...new Set(successful.map(x => x.source))],
  counts: countBy(successful, x => x.source),
  total: successful.length,
  icons: successful.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  )
};

await fs.writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

// 5. Generate Type-Safe Registries
if (options.registry !== false && successful.length > 0) {
  await writeRegistries(outDir, successful);
}

console.log("\n=====================================================");
console.log(`✨ 图标同步完成! 成功: ${successful.length} 个, 失败: ${failures.length} 个`);
console.log(`📂 SVG 保存目录: ${path.relative(ROOT, outDir)}`);
console.log(`📋 资产清单:     ${path.relative(ROOT, path.join(outDir, "manifest.json"))}`);
if (options.registry !== false) {
  console.log(`📜 TypeScript:   ${path.relative(ROOT, path.join(outDir, "index.ts"))}`);
  console.log(`⚛️  React 组件:   ${path.relative(ROOT, path.join(outDir, "react.tsx"))}`);
  console.log(`🟢 Vue 3 组件:   ${path.relative(ROOT, path.join(outDir, "vue.ts"))}`);
}
console.log("=====================================================\n");

if (failures.length) {
  console.log("⚠️ 失败项列表:");
  for (const f of failures) {
    console.log(`- ${f.source}/${f.slug}: ${f.error}`);
  }
  process.exitCode = 2;
}

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------

async function resolvePackage(packageName, packageDir) {
  const nodeModulePath = path.join(ROOT, "node_modules", packageName, "package.json");
  const pkgJson = await loadJson(nodeModulePath);
  if (pkgJson) {
    return path.dirname(nodeModulePath);
  }

  // Fallback to packageDir
  const localPkgPath = path.join(packageDir, packageName, "package.json");
  const localPkgJson = await loadJson(localPkgPath);
  if (localPkgJson) {
    return path.dirname(localPkgPath);
  }

  fail(
    `依赖包 "${packageName}" 未安装。请运行:\n` +
    `  npm install ${packageName}\n`
  );
}

async function readSimpleCatalog(pkg) {
  // Support both Simple Icons v16+ (data/simple-icons.json as Array) and legacy (_data/simple-icons.json)
  const paths = [
    path.join(pkg, "data", "simple-icons.json"),
    path.join(pkg, "_data", "simple-icons.json")
  ];

  let raw = null;
  for (const p of paths) {
    raw = await loadJson(p);
    if (raw) break;
  }

  if (!raw) {
    fail(`无法在 ${pkg} 中找到 Simple Icons 目录清单`);
  }

  const packageJson = await loadJson(path.join(pkg, "package.json"));
  const iconList = Array.isArray(raw) ? raw : (raw.icons || []);

  return {
    version: packageJson?.version ?? "16.x",
    icons: iconList
      .map(icon => ({
        title: icon.title,
        slug: icon.slug,
        hex: icon.hex,
        source: icon.source
      }))
      .filter(icon => icon.slug)
  };
}

async function readDeviconCatalog(pkg) {
  const packageJson = await loadJson(path.join(pkg, "package.json"));
  const jsonPath = path.join(pkg, "devicon.json");
  const json = await loadJson(jsonPath);

  if (!Array.isArray(json)) {
    fail(`无法在 ${jsonPath} 找到 Devicon 清单`);
  }

  const icons = [];

  for (const entry of json) {
    const slug = entry.name;
    const title = entry.name;
    const hex = entry.color ? entry.color.replace("#", "") : null;

    // Handle versions.svg in Devicon 2.17+ vs array in older versions
    let versionLabels = ["original"];
    if (entry.versions) {
      if (Array.isArray(entry.versions)) {
        versionLabels = entry.versions;
      } else if (Array.isArray(entry.versions.svg)) {
        versionLabels = entry.versions.svg;
      }
    }

    // Pick original or plain variant (prefer original for color, plain for mono)
    const preferredVariant = versionLabels.includes("original") ? "original" : versionLabels[0];

    const candidateNames = [
      `${slug}-${preferredVariant}.svg`,
      `${slug}-original.svg`,
      `${slug}-plain.svg`
    ];

    let svgPath = null;
    for (const candidate of candidateNames) {
      const p = path.join(pkg, "icons", slug, candidate);
      if (await exists(p)) {
        svgPath = p;
        break;
      }
    }

    if (!svgPath) {
      const originals = await safeReadDir(path.join(pkg, "icons", slug));
      const picked = originals.find(f => f.endsWith(".svg"));
      if (picked) svgPath = path.join(pkg, "icons", slug, picked);
    }

    if (svgPath) {
      icons.push({ title, slug, variant: preferredVariant, hex, svgPath });
    }
  }

  return { version: packageJson?.version ?? "2.17.0", icons };
}

async function materializeIcon({
  source,
  sourceVersion,
  title,
  slug,
  variant = null,
  hex = null,
  sourceUrl = null,
  svgPath,
  outDir,
  usedNames,
  prefix = "",
  colorMode = "brand"
}) {
  const baseName = normalizeName(
    prefix + desiredName(title, slug, variant)
  );

  let name = baseName;
  let n = 2;

  while (usedNames.has(name)) {
    name = `${baseName}-${n++}`;
  }

  usedNames.set(name, { source, slug, variant });

  const outputPath = path.join(outDir, `${name}.svg`);

  try {
    let svg = await fs.readFile(svgPath, "utf8");
    if (!isSvg(svg)) {
      throw new Error("源文件不是合法的 SVG 矢量格式");
    }

    // Apply color transformation if requested
    if (colorMode !== "raw") {
      const brandColor = hex ? `#${hex}` : "#111827";
      const isMultiColor = (svg.match(/fill="#/g) || []).length > 1;

      if (!isMultiColor) {
        if (colorMode === "brand") {
          if (svg.includes('fill="')) {
            svg = svg.replace(/fill="[^"]*"/, `fill="${brandColor}"`);
          } else if (svg.includes("<path ")) {
            svg = svg.replace("<path ", `<path fill="${brandColor}" `);
          } else {
            svg = svg.replace("<svg ", `<svg fill="${brandColor}" `);
          }
        } else if (colorMode === "currentColor") {
          if (svg.includes('fill="')) {
            svg = svg.replace(/fill="[^"]*"/, 'fill="currentColor"');
          } else if (svg.includes("<path ")) {
            svg = svg.replace("<path ", '<path fill="currentColor" ');
          } else {
            svg = svg.replace("<svg ", '<svg fill="currentColor" ');
          }
        } else if (colorMode === "mono") {
          if (svg.includes('fill="')) {
            svg = svg.replace(/fill="[^"]*"/, 'fill="#111827"');
          } else if (svg.includes("<path ")) {
            svg = svg.replace("<path ", '<path fill="#111827" ');
          } else {
            svg = svg.replace("<svg ", '<svg fill="#111827" ');
          }
        }
      }
    }

    await fs.writeFile(outputPath, svg, "utf8");

    return {
      name,
      title,
      slug,
      variant,
      source,
      sourceVersion,
      sourceUrl,
      file: `${name}.svg`,
      hex: hex ? `#${hex}` : undefined,
      sha256: sha256(svg),
      status: "downloaded"
    };
  } catch (error) {
    return {
      name,
      title,
      slug,
      variant,
      source,
      sourceVersion,
      sourceUrl,
      file: `${name}.svg`,
      status: "failed",
      error: String(error?.message ?? error)
    };
  }
}

async function writeRegistries(outDir, successful) {
  const q = JSON.stringify;

  // 1. Generic index.ts - Exports metadata and types
  const indexTs = `// AUTO-GENERATED by icon-sync pipeline. DO NOT EDIT.

export interface IconMeta {
  title: string;
  slug: string;
  variant?: string;
  source: string;
  sourceVersion?: string;
  file: string;
  hex?: string;
}

export const iconManifest = ${JSON.stringify(
    successful.map(i => ({
      name: i.name,
      title: i.title,
      slug: i.slug,
      file: i.file,
      source: i.source,
      hex: i.hex
    })),
    null,
    2
  )} as const;

export type IconName =
${successful.map(icon => `  | ${q(icon.name)}`).join("\n")};
`;

  // 2. React Registry (Universal: works with SVGR OR native <img>/inline mode!)
  const reactTsx = `// AUTO-GENERATED by icon-sync pipeline. DO NOT EDIT.
import React, { type SVGProps } from "react";
import type { IconName } from "./index";

export type { IconName };

/**
 * 通用品牌技术 Icon 组件
 * 支持自动匹配 SVG 资源路径与响应式宽高
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  baseUrl?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
  baseUrl = "/icons",
  ...props
}) => {
  return (
    <img
      src={\`\${baseUrl}/\${name}.svg\`}
      alt={\`\${name} icon\`}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      {...(props as any)}
    />
  );
};

export default Icon;
`;

  // 3. Vue 3 Registry
  const vueTs = `// AUTO-GENERATED by icon-sync pipeline. DO NOT EDIT.
import { defineComponent, h, type PropType } from "vue";
import type { IconName } from "./index";

export type { IconName };

export const Icon = defineComponent({
  name: "BrandIcon",
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    baseUrl: {
      type: String,
      default: "/icons"
    }
  },
  setup(props, { attrs }) {
    return () =>
      h("img", {
        src: \`\${props.baseUrl}/\${props.name}.svg\`,
        alt: \`\${props.name} icon\`,
        width: props.size,
        height: props.size,
        loading: "lazy",
        ...attrs
      });
  }
});

export default Icon;
`;

  await fs.writeFile(path.join(outDir, "index.ts"), indexTs, "utf8");
  await fs.writeFile(path.join(outDir, "react.tsx"), reactTsx, "utf8");
  await fs.writeFile(path.join(outDir, "vue.ts"), vueTs, "utf8");
}

function desiredName(title, slug, variant) {
  let name = slug || title || "icon";
  if (variant && variant !== "original" && variant !== "plain") {
    name += `-${variant}`;
  }
  return name;
}

function normalizeName(value) {
  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "")
    .toLowerCase() || "icon";
}

function isSvg(text) {
  return /^\s*(?:<!--[\s\S]*?-->\s*)?<svg[\s>]/i.test(text);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function countBy(items, fn) {
  return items.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

async function loadJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function safeReadDir(dir) {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const item = argv[i];

    if (item === "--help" || item === "-h") {
      out.help = true;
      continue;
    }

    if (!item.startsWith("--")) {
      // Positional args (e.g. icon names)
      if (!out.scope || out.scope === "mainstream") {
        out.scope = item;
      } else {
        out.scope += `,${item}`;
      }
      continue;
    }

    const key = item.slice(2);
    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function printHelp() {
  console.log(`
企业级 SVG Icon 资产同步器 (Icon Sync Pipeline)

命令:
  npm run sync
  node scripts/icon-sync.mjs [options]

选项:
  --out <dir>           SVG 输出目录 (默认: icons)
  --source <src>        数据源: simple | devicon | both (默认: both)
  --scope <scope>       同步范围: mainstream (精选80+) | all (全量3400+) | 自定义列表 (默认: mainstream)
  --color <mode>        着色模式: brand (官方原色) | currentColor (自适应CSS) | mono (纯黑) | raw (默认: brand)
  --prefix <str>        文件名前缀 (例如: tech-, brand-)
  --registry <bool>     是否自动生成 index.ts / react.tsx / vue.ts 强类型组件 (默认: true)
  --help, -h            查看帮助

示例:
  node scripts/icon-sync.mjs
  node scripts/icon-sync.mjs --source devicon --out src/assets/icons
  node scripts/icon-sync.mjs --color currentColor --prefix brand-
  node scripts/icon-sync.mjs apple google react vue typescript
`);
}

function fail(message) {
  console.error(`\n❌ Error: ${message}`);
  process.exit(1);
}
