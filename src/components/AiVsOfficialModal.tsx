import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Bug, Zap } from 'lucide-react';

export const AiVsOfficialSection: React.FC = () => {
  const [activeCase, setActiveCase] = useState<number>(0);

  const cases = [
    {
      brand: 'Apple (苹果)',
      slug: 'apple.svg',
      problem: 'AI 生成的叶子角度失真、缺口弧度变形、底部凹陷不对称',
      solution: '官方矢量遵循标准黄金分割弧线与精准咬痕坐标',
      aiSvgPath: 'M12 2C8 2 8 5 8 5C5 5 4 8 4 12C4 17 8 21 12 21C16 21 20 17 20 12C20 9 18 8 16 8C14 8 14 6 15 5C13 5 12.5 3.5 12 2Z',
      officialSvgPath: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z',
      points: [
        'AI 无法理解贝塞尔曲线的黄金分割连续性',
        '顶部苹果叶片的仰角常常被画反或变成普通树叶',
        '右侧咬痕 (Bite) 的圆弧半径经常偏大或边缘凹凸'
      ]
    },
    {
      brand: 'React (反应堆)',
      slug: 'react.svg',
      problem: 'AI 画出的 3 条轨道往往是粗糙的同心圆环，旋转角度非 60°',
      solution: '标准官方矢量由 3 个精确按 60° 旋转的细椭圆与核心圆组成',
      aiSvgPath: 'M12 2A10 10 0 1 0 12 22A10 10 0 1 0 12 2ZM12 9A3 3 0 1 0 12 15A3 3 0 1 0 12 9Z',
      officialSvgPath: 'M12 10.165a1.835 1.835 0 1 0 0 3.67 1.835 1.835 0 0 0 0-3.67zm0-8.665C5.373 1.5 0 6.202 0 12s5.373 10.5 12 10.5 12-4.702 12-10.5S18.627 1.5 12 1.5zm0 1.5c5.799 0 10.5 4.03 10.5 9s-4.701 9-10.5 9-10.5-4.03-10.5-9 4.701-9 10.5-9z',
      points: [
        'React 原子核外电子轨道是严格的 3 条 60° 倾斜椭圆',
        'AI 生成的路径经常缺少极径比例控制，导致重叠变形',
        '轨道线宽在 AI 笔下经常粗细不均、断裂或变成普通圆'
      ]
    },
    {
      brand: 'OpenAI (螺旋花环)',
      slug: 'openai.svg',
      problem: 'AI 生成的花瓣数错乱 (画成 5 瓣或 7 瓣)，线条交叉断裂',
      solution: '官方标志是严格的 6 重旋转对称莫比乌斯环拓扑结构',
      aiSvgPath: 'M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8Z',
      officialSvgPath: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464z',
      points: [
        'OpenAI 徽标具有严格的 6 重旋转对称性 (Rotational Symmetry)',
        'AI 生成时常丢失内部螺旋通道，变成了实心多边形',
        '官方 SVG 保证在 16px 小尺寸下也能保持线条清晰可辨'
      ]
    }
  ];

  const current = cases[activeCase];

  return (
    <div id="ai-vs-official-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Overview Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 mb-3">
            <Bug className="w-3.5 h-3.5" />
            <span>开发者痛点深度剖析</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            为什么在前端开发中，绝不应该用 AI 直接生成 SVG 品牌图标？
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            大语言模型 (LLM) 本质是基于字符 Token 概率预测的文本模型，不具备<strong>空间解析几何</strong>
            与<strong>高精度贝塞尔曲线渲染器</strong>。当提示词要求生成复杂商标时，AI 只能“瞎猜”贝塞尔控制点坐标，
            极易造成严重失真、比例变形、甚至商标辨识错误。
          </p>
        </div>

        {/* 3 Core Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm mb-2">
              1
            </div>
            <h3 className="text-sm font-semibold text-slate-800">贝塞尔控制点失真</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              AI 无法理解精确弧线数学公式，生成的圆角多为生硬多边形或扭曲贝塞尔曲线。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-2">
              2
            </div>
            <h3 className="text-sm font-semibold text-slate-800">商标权威性与专业感</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              大厂 Logo 有严苛的官方品牌设计指南 (Brand Guidelines)。失真图标会让应用瞬间显得极其廉价。
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
              3
            </div>
            <h3 className="text-sm font-semibold text-slate-800">自动化脚本才是正解</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              运行本脚本 1 秒内自动下载权威开源维护的标准 SVG，兼顾规范命名与精准渲染。
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Visual Comparison Stage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Case Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2 overflow-x-auto">
          {cases.map((c, idx) => (
            <button
              key={c.brand}
              onClick={() => setActiveCase(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCase === idx
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {c.brand} 对比
            </button>
          ))}
        </div>

        {/* Comparison Details */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{current.brand} 案例实测</h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">目标命名文件: {current.slug}</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
              几何精度对比分析
            </span>
          </div>

          {/* Visual Dual Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Generated (Flawed) */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mb-4 bg-rose-100/80 px-3 py-1 rounded-full">
                <XCircle className="w-4 h-4" />
                <span>常见 AI 生成的 SVG 结果 (失真)</span>
              </div>

              <div className="w-24 h-24 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-center justify-center my-2">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="#E11D48" className="opacity-80">
                  <path d={current.aiSvgPath} />
                </svg>
              </div>

              <p className="text-xs text-rose-700 font-medium mt-4 max-w-xs">
                ⚠️ {current.problem}
              </p>
            </div>

            {/* Official Standard Vector */}
            <div className="p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/30 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-4 bg-emerald-100/80 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>自动化脚本下载的官方 SVG (标准精准)</span>
              </div>

              <div className="w-24 h-24 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-center my-2">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="#059669">
                  <path d={current.officialSvgPath} />
                </svg>
              </div>

              <p className="text-xs text-emerald-800 font-medium mt-4 max-w-xs">
                ✅ {current.solution}
              </p>
            </div>

          </div>

          {/* Key Bullet Points */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              具体失真技术细节:
            </h4>
            <ul className="space-y-1 text-xs text-slate-600">
              {current.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
