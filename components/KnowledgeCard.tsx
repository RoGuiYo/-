import React, { useMemo } from 'react';
import { CardData, ThemeType } from '../types';
import { Quote, Bookmark } from 'lucide-react';

interface KnowledgeCardProps {
  data: CardData;
  theme: ThemeType;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ data, theme, containerRef }) => {
  // Helper to determine styles based on theme
  const getThemeStyles = () => {
    switch (theme) {
      case ThemeType.DARK:
        return {
          container: "bg-slate-900 text-white border-slate-800",
          accent: data.moodColor || "#60a5fa", 
          textSecondary: "text-slate-400",
          bgDecoration: "bg-slate-800",
          quoteColor: "text-slate-800"
        };
      case ThemeType.GRADIENT:
        return {
          container: "bg-gradient-to-br from-indigo-50 to-blue-100 text-slate-800 border-white/40",
          accent: data.moodColor || "#6366f1",
          textSecondary: "text-slate-500",
          bgDecoration: "bg-white/60 backdrop-blur-sm",
          quoteColor: "text-indigo-200"
        };
      case ThemeType.PAPER:
        return {
          container: "bg-[#fdfbf7] text-[#2c2c2c] border-[#eaddcf]",
          accent: "#8b4513",
          textSecondary: "text-[#8c8c8c]",
          bgDecoration: "bg-[#f4f1ea]",
          quoteColor: "text-[#e8e4db]"
        };
      case ThemeType.ELEGANT:
        return {
          container: "bg-[#0f2f22] text-[#e2e8f0] border-[#1a4533]",
          accent: "#d4af37", // Gold
          textSecondary: "text-[#94a3b8]",
          bgDecoration: "bg-[#143d28]",
          quoteColor: "text-[#1a4533]"
        };
      case ThemeType.OCEAN:
        return {
          container: "bg-[#0f172a] text-[#e2e8f0] border-[#1e293b]",
          accent: "#38bdf8", // Sky blue
          textSecondary: "text-slate-400",
          bgDecoration: "bg-[#1e293b]",
          quoteColor: "text-[#1e293b]"
        };
      case ThemeType.SUNSET:
        return {
          container: "bg-gradient-to-br from-[#fff1eb] to-[#ace0f9] text-slate-800 border-white/40",
          accent: "#f43f5e",
          textSecondary: "text-slate-500",
          bgDecoration: "bg-white/50",
          quoteColor: "text-rose-100"
        };
       case ThemeType.BERRY:
        return {
          container: "bg-[#4a0404] text-rose-50 border-[#7f1d1d]",
          accent: "#fb7185",
          textSecondary: "text-rose-300/70",
          bgDecoration: "bg-[#7f1d1d]",
          quoteColor: "text-[#7f1d1d]"
        };
      case ThemeType.MINIMAL:
      default:
        return {
          container: "bg-white text-gray-900 border-gray-100",
          accent: data.moodColor || "#111827",
          textSecondary: "text-gray-400",
          bgDecoration: "bg-gray-50",
          quoteColor: "text-gray-100"
        };
    }
  };

  // Adaptive Typography Logic
  const { typographyClass, isArticleMode } = useMemo(() => {
    const len = data.content.length;

    if (len < 60) {
      return {
        isArticleMode: false,
        typographyClass: "text-2xl md:text-3xl text-center font-bold leading-relaxed tracking-wide py-8"
      };
    } else if (len < 200) {
      return {
        isArticleMode: false,
        typographyClass: "text-lg md:text-xl leading-loose tracking-wide"
      };
    } else if (len < 400) {
      return {
        isArticleMode: true,
        typographyClass: "text-base md:text-lg leading-relaxed text-justify tracking-normal"
      };
    } else {
      return {
        isArticleMode: true,
        typographyClass: "text-sm md:text-base leading-relaxed text-justify tracking-tight"
      };
    }
  }, [data.content]);

  const styles = getThemeStyles();

  // Check for gradient backgrounds to add texture or adjust border
  const isGradient = theme === ThemeType.GRADIENT || theme === ThemeType.SUNSET;

  // Robust paragraph splitting: handles literal \n strings and actual newlines
  const paragraphs = useMemo(() => {
     return data.content.split(/\\n|\n/).filter(p => p.trim().length > 0);
  }, [data.content]);

  return (
    <div 
      ref={containerRef}
      className={`
        relative w-full max-w-[400px] mx-auto 
        flex flex-col justify-between rounded-none md:rounded-lg shadow-xl 
        transition-all duration-500 p-8 border ${styles.container}
        min-h-[500px] h-auto
      `}
      style={{
        // Simple subtle noise texture overlay for all cards to feel premium
        backgroundImage: theme === ThemeType.PAPER 
          ? 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' 
          : isGradient 
            ? undefined 
            : 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E")'
      }}
    >
      {/* Ambient Glow for Gradient/Dark themes */}
      {(theme === ThemeType.DARK || theme === ThemeType.OCEAN || theme === ThemeType.BERRY) && (
        <>
           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 rounded-full opacity-20 blur-[80px]" style={{ backgroundColor: styles.accent }}></div>
           <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 rounded-full opacity-20 blur-[80px]" style={{ backgroundColor: styles.accent }}></div>
        </>
      )}

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <span className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-3 opacity-70 ${styles.textSecondary}`}>
            Insight Card
          </span>
          <h2 className={`text-2xl md:text-3xl font-serif-sc font-bold leading-tight break-words tracking-tight ${theme === ThemeType.GRADIENT ? 'text-slate-900' : ''}`}>
            {data.title}
          </h2>
          <div className="w-16 h-1.5 mt-4 rounded-full opacity-80" style={{ backgroundColor: styles.accent }}></div>
        </div>
        <div className={`p-3 rounded-full ${styles.bgDecoration}`}>
          <Bookmark className="w-5 h-5" style={{ color: styles.accent }} />
        </div>
      </div>

      {/* Content Body */}
      <div className="relative z-10 flex-grow flex flex-col justify-center my-4 min-h-0">
        {/* Large decorative quote for short texts */}
        {data.content.length < 250 && (
           <Quote className={`absolute -top-4 -left-4 w-20 h-20 transform -scale-x-100 opacity-10 ${styles.quoteColor}`} />
        )}
        
        <div className={`
          font-serif-sc 
          ${theme === ThemeType.DARK || theme === ThemeType.OCEAN || theme === ThemeType.BERRY ? 'font-light antialiased' : 'font-medium text-slate-800'}
          ${typographyClass}
        `}
        style={{ color: theme === ThemeType.DARK || theme === ThemeType.OCEAN || theme === ThemeType.BERRY ? 'inherit' : undefined }}
        >
          {paragraphs.map((paragraph, idx) => {
            // Smart Indentation Logic
            // 1. If it's article mode (long text), we generally indent.
            // 2. BUT if a line is very short (< 30 chars), it's likely a subheading, so we make it Bold and NO indent.
            const isLikelyHeader = isArticleMode && paragraph.length < 30 && !paragraph.match(/[。！？.!?]$/); 
            const shouldIndent = isArticleMode && !isLikelyHeader;

            return (
              <p 
                key={idx} 
                className={`
                  mb-4 last:mb-0
                  ${isLikelyHeader ? 'font-bold mt-6 mb-2' : ''}
                  ${shouldIndent ? 'indent-[2em]' : ''} 
                `}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
        
        {/* Tags */}
        <div className={`flex flex-wrap gap-2 mt-8 ${data.content.length < 60 ? 'justify-center' : 'justify-start'}`}>
          {data.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md border border-transparent bg-opacity-50 ${styles.bgDecoration}`}
              style={{ color: theme === ThemeType.DARK || theme === ThemeType.ELEGANT || theme === ThemeType.OCEAN || theme === ThemeType.BERRY ? 'rgba(255,255,255,0.8)' : styles.accent }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`relative z-10 mt-4 pt-6 border-t border-dashed border-opacity-20 flex justify-between items-end ${theme === ThemeType.DARK ? 'border-gray-500' : 'border-gray-400'}`}>
        <div className="flex flex-col">
           <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${theme === ThemeType.DARK || theme === ThemeType.OCEAN || theme === ThemeType.BERRY ? 'text-white' : 'text-gray-900'}`}>
            <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] text-white font-bold shadow-sm" style={{ backgroundColor: styles.accent }}>
              {data.author ? data.author.charAt(0).toUpperCase() : 'A'}
            </span>
            {data.author || 'Anonymous'}
          </span>
          <span className={`text-[10px] mt-1 font-mono opacity-60 ${styles.textSecondary}`}>
            {data.date} • AI GENERATED
          </span>
        </div>

        {/* QR Code Mockup for aesthetic */}
        <div className={`w-8 h-8 p-0.5 rounded bg-white opacity-80`}>
           <div className="w-full h-full border-2 border-black border-dashed opacity-20"></div>
        </div>
      </div>
    </div>
  );
};