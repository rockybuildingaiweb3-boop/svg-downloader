#!/usr/bin/env python3
"""
=========================================================================
Brand & Tech SVG Icon Downloader (Python 脚本版)
=========================================================================
解决痛点:
AI 生成的 SVG 图标经常出现失真与路径错误。
本脚本使用 Python 标准库自动批量下载官方权威的各大主流公司与技术图标 SVG，
并规范重命名保存为 <名称>.svg (例如 apple.svg, google.svg, react.svg)。

用法:
    python scripts/download_brand_icons.py
    python scripts/download_brand_icons.py --out ./icons --color brand
    python scripts/download_brand_icons.py apple google openai react vue
"""

import os
import sys
import argparse
import urllib.request
import urllib.error
import re

# 常用别名映射
ALIASES = {
    'vue': 'vuedotjs',
    'vuejs': 'vuedotjs',
    'next': 'nextdotjs',
    'nextjs': 'nextdotjs',
    'nuxt': 'nuxt',
    'node': 'nodedotjs',
    'nodejs': 'nodedotjs',
    'aws': 'amazonwebservices',
    'gcp': 'googlecloud',
    'azure': 'microsoftazure',
    'tailwind': 'tailwindcss',
    'vscode': 'visualstudiocode',
    'twitter': 'x',
    'cpp': 'cplusplus',
    'golang': 'go',
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
}

# 权威特殊数据源 (Simple Icons 未收录的大厂或技术)
SPECIAL_SOURCES = {
    'microsoft': {
        'title': 'Microsoft',
        'hex': '00A4EF',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
    },
    'ibm': {
        'title': 'IBM',
        'hex': '052FAD',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
    },
    'adobe': {
        'title': 'Adobe',
        'hex': 'FF0000',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg'
    },
    'oracle': {
        'title': 'Oracle',
        'hex': 'F80000',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg'
    },
    'java': {
        'title': 'Java',
        'hex': 'ED8B00',
        'url': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
    },
    'csharp': {
        'title': 'C#',
        'hex': '239120',
        'url': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
    },
    'visualstudiocode': {
        'title': 'Visual Studio Code',
        'hex': '007ACC',
        'url': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg'
    },
    'microsoftazure': {
        'title': 'Microsoft Azure',
        'hex': '0089D6',
        'url': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg'
    },
    'linkedin': {
        'title': 'LinkedIn',
        'hex': '0A66C2',
        'url': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-plain.svg'
    }
}

DEFAULT_ICONS = [
    'apple', 'google', 'microsoft', 'meta', 'amazon', 'netflix', 'ibm', 'intel', 'amd', 'nvidia', 'tesla', 'adobe', 'oracle', 'salesforce', 'sony', 'samsung',
    'openai', 'anthropic', 'deepseek', 'huggingface', 'mistralai',
    'react', 'vuedotjs', 'angular', 'svelte', 'nextdotjs', 'nuxt', 'tailwindcss', 'vite', 'webpack', 'astro', 'remix', 'html5', 'css3', 'bootstrap', 'sass',
    'javascript', 'typescript', 'python', 'nodedotjs', 'rust', 'go', 'swift', 'kotlin', 'java', 'cplusplus', 'csharp', 'php', 'ruby', 'dart', 'flutter',
    'docker', 'kubernetes', 'linux', 'ubuntu', 'git', 'github', 'gitlab', 'amazonwebservices', 'googlecloud', 'microsoftazure', 'cloudflare', 'vercel', 'supabase', 'firebase', 'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'nginx',
    'figma', 'notion', 'visualstudiocode', 'canva', 'linear', 'jira', 'trello', 'postman',
    'x', 'youtube', 'discord', 'slack', 'telegram', 'linkedin', 'tiktok', 'instagram', 'spotify', 'wechat', 'bilibili'
]

def format_svg(raw_svg: str, hex_color: str, color_mode: str = 'brand', size: int = 24) -> str:
    svg = raw_svg.strip()
    if 'width=' not in svg:
        svg = svg.replace('<svg ', f'<svg width="{size}" height="{size}" ', 1)
    
    # 是否为多色图标
    is_multi_color = svg.count('fill="#') > 1

    if not is_multi_color:
        brand_hex = hex_color if hex_color.startswith('#') else f'#{hex_color}'
        if color_mode == 'brand':
            if 'fill="' in svg:
                svg = re.sub(r'fill="[^"]*"', f'fill="{brand_hex}"', svg, count=1)
            elif '<path ' in svg:
                svg = svg.replace('<path ', f'<path fill="{brand_hex}" ', 1)
            else:
                svg = svg.replace('<svg ', f'<svg fill="{brand_hex}" ', 1)
        elif color_mode == 'currentColor':
            if 'fill="' in svg:
                svg = re.sub(r'fill="[^"]*"', 'fill="currentColor"', svg, count=1)
            elif '<path ' in svg:
                svg = svg.replace('<path ', '<path fill="currentColor" ', 1)
            else:
                svg = svg.replace('<svg ', '<svg fill="currentColor" ', 1)
        elif color_mode == 'mono':
            if 'fill="' in svg:
                svg = re.sub(r'fill="[^"]*"', 'fill="#111827"', svg, count=1)
            elif '<path ' in svg:
                svg = svg.replace('<path ', '<path fill="#111827" ', 1)
    
    return svg

def download_icon(slug: str):
    normalized = ALIASES.get(slug.lower(), slug.lower())
    
    # 1. 检查特殊来源
    if normalized in SPECIAL_SOURCES:
        info = SPECIAL_SOURCES[normalized]
        try:
            req = urllib.request.Request(info['url'], headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                content = resp.read().decode('utf-8')
                return {'slug': normalized, 'hex': info['hex'], 'svg': content}
        except Exception:
            pass

    # 2. 检查 jsDelivr Simple Icons 官方 CDN
    cdn_url = f"https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/{normalized}.svg"
    try:
        req = urllib.request.Request(cdn_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8')
            return {'slug': normalized, 'hex': '111827', 'svg': content}
    except Exception:
        pass

    return None

def main():
    parser = argparse.ArgumentParser(description="官方主流公司与技术精准 SVG 图标下载器")
    parser.add_argument('--out', '-o', default='./public/icons', help="保存文件夹路径")
    parser.add_argument('--color', '-c', default='brand', choices=['brand', 'currentColor', 'mono'], help="颜色模式")
    parser.add_argument('icons', nargs='*', help="可选: 指定需要下载的图标名称 (如 apple google react)")
    
    args = parser.parse_args()
    out_dir = os.path.abspath(args.out)
    os.makedirs(out_dir, exist_ok=True)
    
    targets = [ALIASES.get(s.lower(), s.lower()) for s in args.icons] if args.icons else DEFAULT_ICONS
    
    print("=" * 55)
    print("🚀 启动官方精准 SVG 图标下载器 (Python 版)")
    print(f"📁 目标目录: {out_dir}")
    print(f"🎨 颜色模式: {args.color}")
    print("=" * 55)
    
    success = 0
    failed = 0
    
    for slug in targets:
        data = download_icon(slug)
        if not data:
            print(f"⚠️ 未找到图标: {slug}")
            failed += 1
            continue
            
        file_name = f"{slug}.svg"
        file_path = os.path.join(out_dir, file_name)
        svg_content = format_svg(data['svg'], data['hex'], args.color)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
            
        # 保存常用别名
        for alias, real in ALIASES.items():
            if real == slug and '/' not in alias:
                alias_path = os.path.join(out_dir, f"{alias}.svg")
                with open(alias_path, 'w', encoding='utf-8') as f:
                    f.write(svg_content)
                    
        success += 1
        print(f"✅ 已下载: {file_name:<24} [品牌色: #{data['hex']}]")
        
    print(f"\n✨ 完成! 成功: {success}, 失败: {failed}")
    print(f"📂 保存在: {out_dir}")

if __name__ == '__main__':
    main()
