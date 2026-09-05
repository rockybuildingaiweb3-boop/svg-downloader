#!/usr/bin/env node
/**
 * =========================================================================
 * Brand & Tech SVG Icon Downloader (官方主流公司与技术矢量图标批量下载脚本)
 * =========================================================================
 * 
 * 解决痛点:
 * 网页开发中，AI 生成的 SVG 图标经常出现失真、路径错误、比例变形等问题。
 * 本脚本直接从 Simple Icons 官方库及 Devicon/权威源中下载标准准确的矢量 SVG，
 * 并以规范格式 (如 apple.svg, google.svg, microsoft.svg, react.svg) 命名并保存到本地。
 * 
 * 使用方式:
 * 1. 默认批量下载 80+ 主流大厂与技术图标:
 *    node scripts/download-brand-icons.mjs
 * 
 * 2. 自定义目标文件夹:
 *    node scripts/download-brand-icons.mjs --out ./public/icons
 * 
 * 3. 自定义着色模式:
 *    node scripts/download-brand-icons.mjs --color brand         (官方品牌主色)
 *    node scripts/download-brand-icons.mjs --color currentColor  (通用适应父级 CSS 颜色)
 *    node scripts/download-brand-icons.mjs --color mono          (纯黑/白)
 * 
 * 4. 指定下载部分图标:
 *    node scripts/download-brand-icons.mjs apple google microsoft openai react vue github
 * 
 * 5. 下载 Simple Icons 全量 3400+ 图标:
 *    node scripts/download-brand-icons.mjs --all
 * =========================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 常用别名映射 (方便以自然语言获取，如 vue -> vuedotjs, nextjs -> nextdotjs)
export const SLUG_ALIASES = {
  'vue': 'vuedotjs',
  'vuejs': 'vuedotjs',
  'next': 'nextdotjs',
  'nextjs': 'nextdotjs',
  'nuxt': 'nuxt',
  'nuxtjs': 'nuxt',
  'node': 'nodedotjs',
  'nodejs': 'nodedotjs',
  'aws': 'amazonwebservices',
  'gcp': 'googlecloud',
  'azure': 'microsoftazure',
  'tailwind': 'tailwindcss',
  'vscode': 'visualstudiocode',
  'twitter': 'x',
  'cpp': 'cplusplus',
  'csharp': 'csharp',
  'golang': 'go',
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
};

// 权威备用数据源 (针对因商标原因未收录在 Simple Icons 的知名大厂或技术)
export const SPECIAL_SOURCES = {
  'microsoft': {
    title: 'Microsoft',
    slug: 'microsoft',
    hex: '00A4EF',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  },
  'ibm': {
    title: 'IBM',
    slug: 'ibm',
    hex: '052FAD',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
  },
  'adobe': {
    title: 'Adobe',
    slug: 'adobe',
    hex: 'FF0000',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg'
  },
  'oracle': {
    title: 'Oracle',
    slug: 'oracle',
    hex: 'F80000',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg'
  },
  'java': {
    title: 'Java',
    slug: 'java',
    hex: 'ED8B00',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
  },
  'csharp': {
    title: 'C#',
    slug: 'csharp',
    hex: '239120',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
  },
  'visualstudiocode': {
    title: 'Visual Studio Code',
    slug: 'visualstudiocode',
    hex: '007ACC',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg'
  },
  'microsoftazure': {
    title: 'Microsoft Azure',
    slug: 'microsoftazure',
    hex: '0089D6',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg'
  },
  'linkedin': {
    title: 'LinkedIn',
    slug: 'linkedin',
    hex: '0A66C2',
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-plain.svg'
  }
};

// 预设主流各大公司与常用技术/App图标清单 (80+ 精品主流)
export const DEFAULT_MAINSTREAM_ICONS = [
  // 顶级科技大厂 (Big Tech)
  'apple',
  'google',
  'microsoft',
  'meta',
  'amazon',
  'netflix',
  'ibm',
  'intel',
  'amd',
  'nvidia',
  'tesla',
  'adobe',
  'oracle',
  'salesforce',
  'sony',
  'samsung',

  // 人工智能与前沿模型 (AI & LLMs)
  'openai',
  'anthropic',
  'deepseek',
  'huggingface',
  'mistralai',

  // 前端主流框架与库 (Frontend Frameworks & UI)
  'react',
  'vuedotjs',
  'angular',
  'svelte',
  'nextdotjs',
  'nuxt',
  'tailwindcss',
  'vite',
  'webpack',
  'astro',
  'remix',
  'html5',
  'css3',
  'bootstrap',
  'sass',

  // 编程语言与运行时 (Languages & Runtimes)
  'javascript',
  'typescript',
  'python',
  'nodedotjs',
  'rust',
  'go',
  'swift',
  'kotlin',
  'java',
  'cplusplus',
  'csharp',
  'php',
  'ruby',
  'dart',
  'flutter',

  // 云原生、DevOps 与数据库 (Cloud, DevOps & Databases)
  'docker',
  'kubernetes',
  'linux',
  'ubuntu',
  'git',
  'github',
  'gitlab',
  'amazonwebservices',
  'googlecloud',
  'microsoftazure',
  'cloudflare',
  'vercel',
  'supabase',
  'firebase',
  'postgresql',
  'mysql',
  'mongodb',
  'redis',
  'sqlite',
  'nginx',

  // 设计与生产力工具 (Design & Productivity)
  'figma',
  'notion',
  'visualstudiocode',
  'canva',
  'linear',
  'jira',
  'trello',
  'postman',

  // 社交、协作与媒体 (Social & Media)
  'x',
  'youtube',
  'discord',
  'slack',
  'telegram',
  'linkedin',
  'tiktok',
  'instagram',
  'spotify',
  'wechat',
  'bilibili'
];

/**
 * 格式化输出 SVG 字符串
 * @param {string} rawSvg 原始 SVG 内容
 * @param {string} hex 品牌官方十六进制颜色
 * @param {'brand' | 'currentColor' | 'mono' | 'raw'} colorMode 颜色模式
 * @param {number} size 尺寸 (默认 24)
 */
export function formatSvg(rawSvg, hex, colorMode = 'brand', size = 24) {
  let processed = rawSvg.trim();

  // 确保具有标准的 width 与 height 属性
  if (!processed.includes('width=')) {
    processed = processed.replace('<svg ', `<svg width="${size}" height="${size}" `);
  }

  // 处理颜色注入 (仅在单色 path 且未自带多色内嵌时生效)
  const isMultiColor = processed.includes('fill="#') && (processed.match(/fill="#/g) || []).length > 1;

  if (!isMultiColor) {
    if (colorMode === 'brand') {
      const brandColor = hex.startsWith('#') ? hex : `#${hex}`;
      if (processed.includes('fill="')) {
        processed = processed.replace(/fill="[^"]*"/, `fill="${brandColor}"`);
      } else if (processed.includes('<path ')) {
        processed = processed.replace('<path ', `<path fill="${brandColor}" `);
      } else {
        processed = processed.replace('<svg ', `<svg fill="${brandColor}" `);
      }
    } else if (colorMode === 'currentColor') {
      if (processed.includes('fill="')) {
        processed = processed.replace(/fill="[^"]*"/, 'fill="currentColor"');
      } else if (processed.includes('<path ')) {
        processed = processed.replace('<path ', '<path fill="currentColor" ');
      } else {
        processed = processed.replace('<svg ', '<svg fill="currentColor" ');
      }
    } else if (colorMode === 'mono') {
      if (processed.includes('fill="')) {
        processed = processed.replace(/fill="[^"]*"/, 'fill="#111827"');
      } else if (processed.includes('<path ')) {
        processed = processed.replace('<path ', '<path fill="#111827" ');
      }
    }
  }

  return processed;
}

let simpleIconsCacheMap = null;

function getSimpleIconsMap(simpleIconsModule) {
  if (simpleIconsCacheMap) return simpleIconsCacheMap;
  simpleIconsCacheMap = new Map();
  if (simpleIconsModule) {
    for (const key of Object.keys(simpleIconsModule)) {
      const item = simpleIconsModule[key];
      if (item && item.slug) {
        simpleIconsCacheMap.set(item.slug.toLowerCase(), item);
      }
    }
  }
  return simpleIconsCacheMap;
}

/**
 * 获取图标数据 (优先 Simple Icons，后备权威 CDN / Devicon)
 */
async function getIconData(slug, simpleIconsModule) {
  const normalizedSlug = SLUG_ALIASES[slug.toLowerCase()] || slug.toLowerCase();

  // 1. 检查特殊备用源 (Microsoft, Java, C#, IBM, Adobe 等)
  if (SPECIAL_SOURCES[normalizedSlug]) {
    const special = SPECIAL_SOURCES[normalizedSlug];
    try {
      const res = await fetch(special.url);
      if (res.ok) {
        const svg = await res.text();
        return {
          title: special.title,
          slug: special.slug,
          hex: special.hex,
          svg
        };
      }
    } catch {
      // 备用源网络错误时继续尝试其他方式
    }
  }

  // 2. 如果本地有 simple-icons 依赖
  if (simpleIconsModule) {
    const map = getSimpleIconsMap(simpleIconsModule);
    if (map.has(normalizedSlug)) {
      return map.get(normalizedSlug);
    }
  }

  // 3. 备选方案: 从 jsDelivr CDN 获取 Simple Icons SVG
  try {
    const cdnUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${normalizedSlug}.svg`;
    const res = await fetch(cdnUrl);
    if (res.ok) {
      const svg = await res.text();
      return {
        title: normalizedSlug.charAt(0).toUpperCase() + normalizedSlug.slice(1),
        slug: normalizedSlug,
        hex: '111827',
        svg
      };
    }
  } catch {
    // 忽略网络重试错误
  }

  return null;
}

/**
 * CLI 命令行执行主函数
 */
async function main() {
  const args = process.argv.slice(2);
  let outDir = path.resolve(process.cwd(), 'public/icons');
  let colorMode = 'brand'; // 'brand', 'currentColor', 'mono', 'raw'
  let downloadAll = false;
  const customSlugs = [];

  // 解析 CLI 参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--out' || arg === '-o') {
      if (args[i + 1]) {
        outDir = path.resolve(process.cwd(), args[++i]);
      }
    } else if (arg === '--color' || arg === '-c') {
      if (args[i + 1]) {
        colorMode = args[++i];
      }
    } else if (arg === '--all') {
      downloadAll = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
Brand & Tech SVG Downloader
===========================
参数说明:
  --out, -o <dir>         保存目录 (默认: ./public/icons)
  --color, -c <mode>      着色模式: brand(官方主色), currentColor(适应父级), mono(纯黑)
  --all                   下载 Simple Icons 全部 3400+ 图标
  [name1 name2 ...]       指定需要下载的品牌名称，例如: apple google microsoft react
      `);
      return;
    } else if (!arg.startsWith('-')) {
      customSlugs.push(arg);
    }
  }

  // 加载 simple-icons 库
  let simpleIcons = null;
  try {
    simpleIcons = await import('simple-icons');
  } catch {
    console.log('ℹ️ 未检测到本地 simple-icons 依赖，将使用 CDN 网络获取...');
  }

  // 确保目标文件夹存在
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`\n======================================================`);
  console.log(`🚀 正在启动官方精准 SVG 图标下载器`);
  console.log(`📁 目标保存路径: ${outDir}`);
  console.log(`🎨 颜色模式: ${colorMode}`);
  console.log(`======================================================\n`);

  let targetList = [];

  if (downloadAll && simpleIcons) {
    targetList = Object.values(simpleIcons).map(i => i.slug);
  } else if (customSlugs.length > 0) {
    targetList = customSlugs.map(s => SLUG_ALIASES[s.toLowerCase()] || s.toLowerCase());
  } else {
    targetList = DEFAULT_MAINSTREAM_ICONS;
  }

  let successCount = 0;
  let failedCount = 0;

  for (const slug of targetList) {
    const icon = await getIconData(slug, simpleIcons);
    if (!icon || !icon.svg) {
      console.warn(`⚠️ 未找到图标: ${slug}`);
      failedCount++;
      continue;
    }

    const fileName = `${slug}.svg`;
    const filePath = path.join(outDir, fileName);
    const formatted = formatSvg(icon.svg, icon.hex, colorMode);

    fs.writeFileSync(filePath, formatted, 'utf-8');

    // 友好别名保存 (例如 vuedotjs 额外保留 vue.svg，让前端代码 import 或引用更方便)
    for (const [alias, realSlug] of Object.entries(SLUG_ALIASES)) {
      if (realSlug === slug && !alias.includes('/')) {
        const aliasPath = path.join(outDir, `${alias}.svg`);
        fs.writeFileSync(aliasPath, formatted, 'utf-8');
      }
    }

    successCount++;
    process.stdout.write(`✅ 已下载: ${fileName.padEnd(24)} [品牌色: #${icon.hex}]\n`);
  }

  console.log(`\n✨ 下载完成! 成功: ${successCount} 个图标, 失败: ${failedCount} 个`);
  console.log(`📂 文件已保存至: ${outDir}\n`);
  process.exit(0);
}

// 仅在直接执行时调用 main()
const isDirectRun = process.argv[1] && (
  process.argv[1] === fileURLToPath(import.meta.url) ||
  process.argv[1].endsWith('download-brand-icons.mjs')
);

if (isDirectRun) {
  main().catch(err => {
    console.error('❌ 执行出错:', err);
    process.exit(1);
  });
}
