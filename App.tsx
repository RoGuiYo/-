import React, { useState, useRef, useEffect } from 'react';
import { Wand2, Download, LayoutTemplate, PenTool, Globe, Sparkles, Printer, CheckCircle2 } from 'lucide-react';
import { processTextToCard } from './services/geminiService';
import { KnowledgeCard } from './components/KnowledgeCard';
import { CardData, ThemeType, THEMES, Language } from './types';

// Translations
const TRANSLATIONS = {
  en: {
    title: "InsightCard",
    subtitle: "Turn thoughts into shareable art.",
    inputLabel: "Your Content (Max 500 chars)",
    placeholder: "Paste a quote, a paragraph from a book, or your own random thoughts here...",
    chars: "chars",
    generate: "Print Card",
    generating: "Processing...",
    themeLabel: "Card Aesthetic",
    footer: "Powered by Gemini 2.5 Flash",
    preview: "Preview Mode",
    download: "Save Card",
    downloadDesktop: "To save the image:\n\nOn Desktop: Use your screenshot tool (Win+Shift+S or Cmd+Shift+4).\nOn Mobile: Take a screenshot and crop.",
    error: "Something went wrong. Please try again."
  },
  zh: {
    title: "灵感卡片",
    subtitle: "将思想转化为精美的分享卡片。",
    inputLabel: "内容输入 (限500字)",
    placeholder: "在这里粘贴一段金句、一篇文章片段，或者你随手记下的感悟...",
    chars: "字符",
    generate: "生成卡片",
    generating: "正在设计...",
    themeLabel: "卡片主题",
    footer: "由 Gemini 2.5 Flash 驱动",
    preview: "预览模式",
    download: "保存图片",
    downloadDesktop: "保存图片方法：\n\n电脑端：请使用截图工具 (Win+Shift+S 或 Cmd+Shift+4)。\n手机端：请直接截图并裁剪。",
    error: "生成时出错了，请重试。"
  }
};

const MAX_CHARS = 500;

type AnimationState = 'idle' | 'generating' | 'printing' | 'complete';

export default function App() {
  const [language, setLanguage] = useState<Language>('zh');
  const [input, setInput] = useState('');
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(ThemeType.MINIMAL);
  
  // Initial mock data
  const [cardData, setCardData] = useState<CardData>({
    title: '欢迎使用',
    content: '在左侧输入你喜欢的文字，点击生成，机器将为您打印一张精美的知识卡片。\n\n系统会自动排版、配色，且完整保留您的原文内容，高度根据文字自动调整。',
    tags: ['AI', '设计', '美学'],
    author: 'InsightCard',
    date: new Date().toLocaleDateString(),
    moodColor: '#6366f1'
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  const handleGenerate = async () => {
    if (!input.trim()) return;

    // Start Animation Sequence
    setAnimationState('generating'); // Old card falls off if we had one, lights blink

    try {
      const aiResponse = await processTextToCard(input, language);
      
      // Wait a bit for the "processing" feel if API is too fast
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCardData({
        title: aiResponse.title,
        content: aiResponse.refinedContent,
        tags: aiResponse.tags,
        author: aiResponse.authorSuggestion || (language === 'zh' ? '佚名' : 'Anonymous'),
        moodColor: aiResponse.moodColor,
        date: new Date().toLocaleDateString()
      });
      
      setAnimationState('printing');

      // Reset to complete after print animation (2.5s)
      setTimeout(() => {
        setAnimationState('complete');
      }, 2500);
      
    } catch (error) {
      console.error(error);
      alert(t.error);
      setAnimationState('idle');
    }
  };

  const handleDownload = () => {
    alert(t.downloadDesktop);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#eef2f6] text-slate-800 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Controls */}
      <div className="w-full lg:w-1/3 p-6 lg:p-8 flex flex-col h-auto lg:h-screen overflow-y-auto border-r border-gray-200 bg-white z-20 shadow-xl">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-serif-sc">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <PenTool className="w-5 h-5" /> 
              </div>
              {t.title}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">{t.subtitle}</p>
          </div>
          
          <button 
            onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            <Globe className="w-3 h-3" />
            {language === 'en' ? '中文' : 'EN'}
          </button>
        </div>

        <div className="flex-grow flex flex-col gap-6">
          <div className="relative group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{t.inputLabel}</label>
            <textarea
              className="w-full h-40 p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-base leading-relaxed font-serif-sc"
              placeholder={t.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_CHARS}
            />
            <div className={`absolute bottom-4 right-4 text-xs font-mono px-2 py-1 rounded-full transition-colors ${input.length >= MAX_CHARS ? 'bg-red-50 text-red-500 font-bold' : 'bg-gray-50 text-gray-400'}`}>
              {input.length} / {MAX_CHARS}
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" /> {t.themeLabel}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {THEMES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentTheme(item.id as ThemeType)}
                  className={`
                    group relative w-full aspect-square rounded-xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden
                    ${currentTheme === item.id ? 'border-indigo-600 shadow-lg scale-105 ring-2 ring-indigo-600/20' : 'border-transparent hover:scale-95 shadow-sm'}
                  `}
                  style={{ background: item.color === '#ffffff' ? '#ffffff' : item.color }}
                  title={item.name}
                >
                   {/* Checkmark for selected */}
                   {currentTheme === item.id && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <CheckCircle2 className={`w-6 h-6 ${item.id === ThemeType.MINIMAL || item.id === ThemeType.PAPER || item.id === ThemeType.SUNSET ? 'text-slate-800' : 'text-white'}`} />
                     </div>
                   )}
                   {/* Hover effect name */}
                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     {item.name}
                   </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={handleGenerate}
              disabled={animationState === 'generating' || animationState === 'printing' || !input.trim()}
              className={`
                w-full py-4 rounded-2xl font-bold text-white shadow-xl transform transition-all flex items-center justify-center gap-3
                ${!input.trim() || animationState === 'generating' ? 'bg-slate-400 scale-95' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95'}
              `}
            >
              {animationState === 'generating' || animationState === 'printing' ? (
                <>
                  <Printer className="animate-bounce w-5 h-5" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {t.generate}
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-[10px] text-gray-400 text-center uppercase tracking-widest">
          {t.footer}
        </div>
      </div>

      {/* RIGHT SIDE: The Printer Machine */}
      <div className="w-full lg:w-2/3 bg-[#dbeafe] relative flex flex-col items-center justify-start pt-12 h-[80vh] lg:h-screen overflow-hidden perspective-1000">
        
        {/* Machine Head (The Dispenser) */}
        <div className="relative z-30 w-full max-w-[480px] -mt-6 mb-0">
           {/* The glowing slot */}
           <div className="h-4 mx-6 bg-slate-900 rounded-full blur-xl opacity-40 absolute bottom-0 left-0 right-0"></div>
           
           <div className="bg-white rounded-3xl shadow-2xl p-4 border-b-8 border-gray-100 relative overflow-hidden">
             {/* Status Light Strip */}
             <div className={`absolute bottom-0 left-0 w-full h-1.5 transition-all duration-500 
               ${animationState === 'generating' ? 'bg-amber-400 animate-machine-pulse' : 
                 animationState === 'printing' ? 'bg-green-400 animate-pulse' : 'bg-indigo-500'} 
             `}></div>

             <div className="flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${animationState === 'generating' ? 'bg-amber-500 animate-ping' : 'bg-slate-200'}`}></div>
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${animationState === 'printing' ? 'bg-green-500 animate-pulse' : 'bg-slate-200'}`}></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {animationState === 'idle' ? 'READY' : animationState === 'generating' ? 'PROCESSING...' : 'PRINTING...'}
                  </span>
                </div>
                <div className="font-bold text-slate-300 tracking-widest text-xs">INSIGHT-PRINTER-v2.5</div>
             </div>
           </div>
        </div>

        {/* The "Paper" Drop Zone */}
        <div className="relative w-full max-w-[480px] h-full flex justify-center overflow-y-auto pb-20 hide-scrollbar">
          
           {/* Printing Card Wrapper */}
           <div className={`
              transition-all duration-500 ease-out relative z-20 w-full flex justify-center
              ${animationState === 'printing' ? 'animate-print' : ''}
              ${animationState === 'generating' ? 'opacity-0' : 'opacity-100'}
              ${animationState === 'idle' || animationState === 'complete' ? 'transform-none' : ''}
           `}>
              <div className={`w-full ${animationState === 'generating' ? 'animate-fall' : ''}`}>
                 <KnowledgeCard 
                    data={cardData} 
                    theme={currentTheme} 
                    containerRef={cardRef}
                  />
              </div>
           </div>

           {/* Shadow on the floor (visual grounding) */}
           {animationState !== 'generating' && (
             <div className="absolute top-[500px] w-[300px] h-4 bg-black/10 blur-xl rounded-[100%] z-10 transition-opacity duration-1000 delay-1000 pointer-events-none"></div>
           )}
        </div>

        {/* Floating Actions (Only visible when idle/complete) */}
        {(animationState === 'idle' || animationState === 'complete') && (
          <div className="absolute bottom-10 z-40 flex gap-4 animate-fade-in-up">
            <button 
              onClick={handleDownload}
              className="px-6 py-3 bg-white rounded-full shadow-xl text-slate-700 font-bold flex items-center gap-2 hover:scale-105 transition-transform border border-gray-100 hover:text-indigo-600"
            >
              <Download className="w-5 h-5" />
              {t.download}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}