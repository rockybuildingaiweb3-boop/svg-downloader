#!/usr/bin/env bash
# =========================================================================
# Brand & Tech SVG Downloader (Bash / cURL 版)
# =========================================================================
# 用法:
#   chmod +x scripts/download-icons.sh
#   ./scripts/download-icons.sh ./public/icons
# =========================================================================

OUT_DIR="${1:-./public/icons}"
mkdir -p "$OUT_DIR"

echo "======================================================"
echo "🚀 开始下载官方主流品牌与技术精准 SVG 图标"
echo "📁 保存目录: $OUT_DIR"
echo "======================================================"

ICONS=(
  apple google meta amazon netflix intel amd nvidia tesla adobe salesforce sony samsung
  openai anthropic deepseek huggingface mistralai
  react vuedotjs angular svelte nextdotjs nuxt tailwindcss vite webpack astro remix html5 css3 bootstrap sass
  javascript typescript python nodedotjs rust go swift kotlin cplusplus php ruby dart flutter
  docker kubernetes linux ubuntu git github gitlab amazonwebservices googlecloud cloudflare vercel supabase firebase postgresql mysql mongodb redis sqlite nginx
  figma notion canva linear jira trello postman
  x youtube discord slack telegram tiktok instagram spotify wechat bilibili
)

SUCCESS=0
FAILED=0

for icon in "${ICONS[@]}"; do
  URL="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${icon}.svg"
  DEST="$OUT_DIR/${icon}.svg"
  
  if curl -s -f -L "$URL" -o "$DEST"; then
    echo "✅ 已下载: ${icon}.svg"
    ((SUCCESS++))
  else
    echo "⚠️ 无法直接从 CDN 获取: ${icon}"
    ((FAILED++))
  fi
done

# 单独获取 Microsoft 等特殊源
curl -s -f -L "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" -o "$OUT_DIR/microsoft.svg" && echo "✅ 已下载: microsoft.svg" && ((SUCCESS++))
curl -s -f -L "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" -o "$OUT_DIR/vscode.svg" && echo "✅ 已下载: vscode.svg" && ((SUCCESS++))
curl -s -f -L "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" -o "$OUT_DIR/java.svg" && echo "✅ 已下载: java.svg" && ((SUCCESS++))
curl -s -f -L "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" -o "$OUT_DIR/csharp.svg" && echo "✅ 已下载: csharp.svg" && ((SUCCESS++))
curl -s -f -L "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-plain.svg" -o "$OUT_DIR/linkedin.svg" && echo "✅ 已下载: linkedin.svg" && ((SUCCESS++))

# 创建常用便捷别名
[ -f "$OUT_DIR/vuedotjs.svg" ] && cp "$OUT_DIR/vuedotjs.svg" "$OUT_DIR/vue.svg"
[ -f "$OUT_DIR/nextdotjs.svg" ] && cp "$OUT_DIR/nextdotjs.svg" "$OUT_DIR/nextjs.svg"
[ -f "$OUT_DIR/nodedotjs.svg" ] && cp "$OUT_DIR/nodedotjs.svg" "$OUT_DIR/node.svg"
[ -f "$OUT_DIR/amazonwebservices.svg" ] && cp "$OUT_DIR/amazonwebservices.svg" "$OUT_DIR/aws.svg"
[ -f "$OUT_DIR/googlecloud.svg" ] && cp "$OUT_DIR/googlecloud.svg" "$OUT_DIR/gcp.svg"
[ -f "$OUT_DIR/visualstudiocode.svg" ] && cp "$OUT_DIR/visualstudiocode.svg" "$OUT_DIR/vscode.svg"

echo "======================================================"
echo "✨ 下载完成! 成功: $SUCCESS 个图标"
echo "📂 保存在: $OUT_DIR"
