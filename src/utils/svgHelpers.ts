import JSZip from 'jszip';
import { ColorMode, IconItem } from '../types';

/**
 * Format and inject colors into an SVG string
 */
export function getFormattedSvg(
  rawSvg: string,
  hex: string,
  colorMode: ColorMode,
  size?: number
): string {
  let processed = rawSvg.trim();

  // If a size is specified, replace or inject width and height
  if (size) {
    if (processed.includes('width="')) {
      processed = processed.replace(/width="[^"]*"/, `width="${size}"`);
    } else {
      processed = processed.replace('<svg ', `<svg width="${size}" `);
    }

    if (processed.includes('height="')) {
      processed = processed.replace(/height="[^"]*"/, `height="${size}"`);
    } else {
      processed = processed.replace('<svg ', `<svg height="${size}" `);
    }
  }

  // Check if SVG is multi-colored (like Microsoft with 4 colors or Google)
  const isMultiColor = (processed.match(/fill="#/g) || []).length > 1;

  if (!isMultiColor) {
    const brandColor = hex.startsWith('#') ? hex : `#${hex}`;

    if (colorMode === 'brand') {
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
    } else if (colorMode === 'mono-dark') {
      if (processed.includes('fill="')) {
        processed = processed.replace(/fill="[^"]*"/, 'fill="#111827"');
      } else if (processed.includes('<path ')) {
        processed = processed.replace('<path ', '<path fill="#111827" ');
      } else {
        processed = processed.replace('<svg ', '<svg fill="#111827" ');
      }
    } else if (colorMode === 'mono-light') {
      if (processed.includes('fill="')) {
        processed = processed.replace(/fill="[^"]*"/, 'fill="#F9FAFB"');
      } else if (processed.includes('<path ')) {
        processed = processed.replace('<path ', '<path fill="#F9FAFB" ');
      } else {
        processed = processed.replace('<svg ', '<svg fill="#F9FAFB" ');
      }
    }
  }

  return processed;
}

/**
 * Trigger immediate browser download of a single SVG file
 */
export function downloadSingleSvg(item: IconItem, colorMode: ColorMode) {
  const content = getFormattedSvg(item.svg, item.hex, colorMode, 24);
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.slug}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate browser SHA256 string
 */
async function computeSha256(text: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}
  return 'sha256-precomputed';
}

/**
 * Generate and trigger batch ZIP download for raw SVG files
 */
export async function downloadZip(
  items: IconItem[],
  colorMode: ColorMode,
  zipName: string = 'brand-tech-icons.zip'
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('icons') || zip;

  for (const item of items) {
    const formattedSvg = getFormattedSvg(item.svg, item.hex, colorMode, 24);
    folder.file(`${item.slug}.svg`, formattedSvg);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate Full Engineering Package (SVGs + manifest.json + index.ts + react.tsx + vue.ts)
 */
export async function downloadEngineeringZip(
  items: IconItem[],
  colorMode: ColorMode,
  zipName: string = 'brand-tech-icons-bundle.zip'
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('icons') || zip;

  const manifestIcons = [];

  for (const item of items) {
    const formattedSvg = getFormattedSvg(item.svg, item.hex, colorMode, 24);
    folder.file(`${item.slug}.svg`, formattedSvg);

    const hash = await computeSha256(formattedSvg);
    manifestIcons.push({
      name: item.slug,
      title: item.title,
      slug: item.slug,
      category: item.category,
      source: item.source || 'simple-icons',
      file: `${item.slug}.svg`,
      hex: `#${item.hex}`,
      sha256: hash,
      status: 'downloaded'
    });
  }

  // 1. Generate manifest.json
  const manifest = {
    generatedAt: new Date().toISOString(),
    colorMode,
    total: items.length,
    sources: [...new Set(manifestIcons.map(x => x.source))],
    icons: manifestIcons
  };
  folder.file('manifest.json', JSON.stringify(manifest, null, 2));

  // 2. Generate index.ts
  const q = JSON.stringify;
  const indexTs = `// AUTO-GENERATED by icon-sync pipeline. DO NOT EDIT.

export interface IconMeta {
  name: string;
  title: string;
  slug: string;
  category: string;
  source: string;
  file: string;
  hex: string;
}

export const iconManifest = ${JSON.stringify(manifestIcons, null, 2)} as const;

export type IconName =
${items.map(icon => `  | ${q(icon.slug)}`).join('\n')};
`;
  folder.file('index.ts', indexTs);

  // 3. Generate react.tsx
  const reactTsx = `// AUTO-GENERATED by icon-sync pipeline. DO NOT EDIT.
import React, { type SVGProps } from "react";
import type { IconName } from "./index";

export type { IconName };

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  baseUrl?: string;
}

/**
 * 通用品牌与技术 Icon 组件
 * 零配置即用: 自动按 name 映射对应的 SVG 文件
 */
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
  folder.file('react.tsx', reactTsx);

  // 4. Generate vue.ts
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
  folder.file('vue.ts', vueTs);

  // 5. Generate README.md
  const readmeMd = `# Brand & Tech Icons Package

自动生成的企业级标准 SVG 图标库资产包。

## 目录结构
\`\`\`text
icons/
├── apple.svg
├── google.svg
├── react.svg
├── ...
├── manifest.json       # 资产清单与 SHA-256 校验
├── index.ts            # TypeScript 联合类型与元数据
├── react.tsx           # React <Icon name="apple" /> 组件
└── vue.ts              # Vue 3 <Icon name="apple" /> 组件
\`\`\`

## 在 React 项目中使用
\`\`\`tsx
import { Icon } from "./icons/react";

export function Header() {
  return (
    <div>
      <Icon name="apple" size={24} />
      <Icon name="react" size={24} />
    </div>
  );
}
\`\`\`

## 在 Vue 3 中使用
\`\`\`vue
<script setup>
import { Icon } from "./icons/vue";
</script>

<template>
  <Icon name="vue" :size="24" />
</template>
\`\`\`
`;
  folder.file('README.md', readmeMd);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate React Component code (JSX) for an icon
 */
export function generateReactJsx(item: IconItem): string {
  const pascalName = item.slug
    .split(/[-_.]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Icon';

  // Extract path or inner elements
  const innerMatch = item.svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = innerMatch ? innerMatch[1].trim() : '';

  // Extract viewBox if present
  const viewBoxMatch = item.svg.match(/viewBox="([^"]*)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  return `import React from 'react';

export interface ${pascalName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const ${pascalName}: React.FC<${pascalName}Props> = ({
  size = 24,
  color = '#${item.hex}',
  className = '',
  ...props
}) => {
  return (
    <svg
      role="img"
      viewBox="${viewBox}"
      width={size}
      height={size}
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>${item.title}</title>
      ${innerContent}
    </svg>
  );
};

export default ${pascalName};
`;
}

/**
 * Copy text with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
}
