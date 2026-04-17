import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Coins, Shuffle, Sprout, Users, ChevronRight, X, ArrowRight, Gift, RotateCcw, Trophy, Volume2, VolumeX, Check, Clock, Layers } from 'lucide-react';

// ============ FONTS & GLOBAL STYLE ============
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,800&family=Gowun+Dodum&family=Noto+Sans+KR:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;600&display=swap');
    
    .font-display { font-family: 'Fraunces', 'Noto Sans KR', serif; font-optical-sizing: auto; }
    .font-body { font-family: 'Noto Sans KR', 'Gowun Dodum', sans-serif; }
    .font-hand { font-family: 'Gowun Dodum', 'Noto Sans KR', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
    
    .paper-texture {
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(139, 94, 60, 0.04) 0px, transparent 2px),
        radial-gradient(circle at 80% 70%, rgba(139, 94, 60, 0.04) 0px, transparent 2px),
        radial-gradient(circle at 50% 50%, rgba(139, 94, 60, 0.03) 0px, transparent 3px);
      background-size: 23px 23px, 31px 31px, 43px 43px;
    }
    
    .card-shadow {
      box-shadow: 
        0 1px 0 rgba(0,0,0,0.05),
        0 2px 4px rgba(72, 50, 30, 0.08),
        0 8px 16px rgba(72, 50, 30, 0.06);
    }
    .card-shadow-lg {
      box-shadow: 
        0 2px 0 rgba(0,0,0,0.06),
        0 8px 16px rgba(72, 50, 30, 0.12),
        0 20px 40px rgba(72, 50, 30, 0.08);
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes dealIn {
      from { transform: translateY(-40px) rotate(-8deg); opacity: 0; }
      to { transform: translateY(0) rotate(0); opacity: 1; }
    }
    @keyframes pop {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes coinSpin {
      0% { transform: rotateY(0deg) scale(0.5); opacity: 0; }
      50% { transform: rotateY(180deg) scale(1.2); opacity: 1; }
      100% { transform: rotateY(360deg) scale(1); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes fieldPulse {
      0% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.65), inset 0 0 0 2px rgba(180, 83, 9, 0.6); transform: scale(1); }
      50% { box-shadow: 0 0 0 10px rgba(180, 83, 9, 0), inset 0 0 0 3px rgba(180, 83, 9, 0.3); transform: scale(1.035); }
      100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0), inset 0 0 0 0 rgba(180, 83, 9, 0); transform: scale(1); }
    }
    @keyframes cardDrop {
      0% { transform: translateY(-60px) scale(1.2) rotate(-4deg); opacity: 0; }
      60% { transform: translateY(10px) scale(1.05) rotate(2deg); opacity: 1; }
      100% { transform: translateY(0) scale(1) rotate(0); opacity: 1; }
    }
    @keyframes cardLeave {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.8) translateY(-20px); opacity: 0; }
    }
    .deal-in { animation: dealIn 0.4s ease-out backwards; }
    .slide-up { animation: slideUp 0.3s ease-out backwards; }
    .slide-in { animation: slideIn 0.25s ease-out backwards; }
    .pop-in { animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) backwards; }
    .coin-spin { animation: coinSpin 0.6s ease-out; }
    .breathe { animation: pulse 2.5s ease-in-out infinite; }
    .field-just-planted { animation: fieldPulse 0.9s ease-out; }
    .card-drop { animation: cardDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .card-leave { animation: cardLeave 0.5s ease-in forwards; }
    
    .btn-tactile {
      transition: transform 0.08s ease-out, box-shadow 0.08s ease-out;
    }
    .btn-tactile:active {
      transform: translateY(2px);
    }
    
    .shimmer-gold {
      background: linear-gradient(90deg, #d4a04a, #f5d782, #d4a04a);
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    
    .seed-pattern::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at center, currentColor 1px, transparent 1.5px);
      background-size: 8px 8px;
      opacity: 0.06;
      pointer-events: none;
    }
    
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// ============ BEAN DATA ============
// Canonical Bohnanza base-game bean types with real coin thresholds
const BEAN_TYPES = {
  blue:    { ko: '파란콩',   en: 'Blue Bean',      total: 20, thresholds: [4, 6, 8, 10], color: '#2E5090', dark: '#1E3A6B', light: '#5E80C2', shape: 'oval' },
  chili:   { ko: '고추콩',   en: 'Chili Bean',     total: 18, thresholds: [3, 6, 8, 9],  color: '#C0392B', dark: '#8B1E12', light: '#E06356', shape: 'curved' },
  stink:   { ko: '악취콩',   en: 'Stink Bean',     total: 16, thresholds: [3, 5, 7, 8],  color: '#6B4E2E', dark: '#4A3620', light: '#8E6F48', shape: 'lumpy' },
  green:   { ko: '초록콩',   en: 'Green Bean',     total: 14, thresholds: [3, 5, 6, 7],  color: '#4F7A3A', dark: '#355525', light: '#78A261', shape: 'long' },
  soy:     { ko: '메주콩',   en: 'Soy Bean',       total: 12, thresholds: [2, 4, 6, 7],  color: '#C9A86B', dark: '#8F7645', light: '#E3C99A', shape: 'round' },
  eye:     { ko: '동부콩',   en: 'Black-eyed',     total: 10, thresholds: [2, 4, 5, 6],  color: '#D4C5A0', dark: '#9F9068', light: '#EEDFBC', shape: 'eye' },
  red:     { ko: '팥',        en: 'Red Bean',       total: 8,  thresholds: [2, 3, 4, 5],  color: '#9B2D2D', dark: '#6E1919', light: '#C54F4F', shape: 'oval' },
  garden:  { ko: '강낭콩',   en: 'Garden Bean',    total: 6,  thresholds: [null, 2, 3],  color: '#7B4A9B', dark: '#552F6F', light: '#A579C2', shape: 'speckled' },
};

const BEAN_KEYS = Object.keys(BEAN_TYPES);

// ============ DECK HELPERS ============
function createDeck() {
  const deck = [];
  let id = 0;
  for (const key of BEAN_KEYS) {
    for (let i = 0; i < BEAN_TYPES[key].total; i++) {
      deck.push({ id: id++, type: key });
    }
  }
  return shuffle(deck);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Given a bean type and current field size, compute coins if harvested now
function coinsForField(beanType, size) {
  if (size < 1) return 0;
  const { thresholds } = BEAN_TYPES[beanType];
  let coins = 0;
  thresholds.forEach((t, i) => {
    if (t !== null && size >= t) coins = i + 1;
  });
  return coins;
}

// Can we harvest this field? Rule: cannot voluntarily harvest a field of size 1
// if another field has more than 1. However final forced harvests bypass this.
function canHarvestField(fields, idx, force = false) {
  const f = fields[idx];
  if (!f || f.count === 0) return false;
  if (force) return true;
  if (f.count === 1) {
    // only allowed if all other non-empty fields also have 1
    const others = fields.filter((_, i) => i !== idx && fields[i].count > 1);
    if (others.length > 0) return false;
  }
  return true;
}

// ============ BEAN CARD VISUAL — PERSONIFIED CHARACTERS ============
function BeanGlyph({ type, size = 32 }) {
  const bean = BEAN_TYPES[type];
  const s = size;
  const shadow = <ellipse cx="50" cy="88" rx="26" ry="3" fill="#000" opacity="0.2"/>;
  
  const renderChar = () => {
    switch (type) {
      case 'blue': return (
        // Zen monk bean — meditating, droplet on head
        <g>
          {shadow}
          <path d="M50 8 C47 14 44 18 47 22 C49 24 51 24 53 22 C56 18 53 14 50 8 Z" fill={bean.light}/>
          <circle cx="48.5" cy="15" r="1.1" fill="#fff" opacity="0.85"/>
          <ellipse cx="50" cy="58" rx="32" ry="26" fill={bean.color}/>
          <ellipse cx="38" cy="46" rx="12" ry="8" fill={bean.light} opacity="0.45"/>
          <path d="M34 55 Q40 50 46 55" stroke={bean.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M54 55 Q60 50 66 55" stroke={bean.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M42 67 Q50 72 58 67" stroke={bean.dark} strokeWidth="2.3" fill="none" strokeLinecap="round"/>
          <circle cx="28" cy="62" r="3" fill={bean.light} opacity="0.55"/>
          <circle cx="72" cy="62" r="3" fill={bean.light} opacity="0.55"/>
        </g>
      );
      
      case 'chili': return (
        // Fiery angry chili with green stem & flame
        <g>
          {shadow}
          <path d="M46 16 Q40 8 34 11 Q38 17 46 19 Z" fill="#4F7A3A"/>
          <path d="M44 16 Q43 12 45 9" stroke="#355525" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M20 48 Q15 40 19 34 Q22 40 22 48 Z" fill="#FFD93D" opacity="0.55"/>
          <path d="M80 48 Q85 40 81 34 Q78 40 78 48 Z" fill="#FFD93D" opacity="0.55"/>
          <path d="M26 52 Q22 28 44 22 Q68 20 74 44 Q80 70 60 80 Q35 84 28 70 Q22 60 26 52 Z" fill={bean.color}/>
          <path d="M34 38 Q40 30 52 30" stroke={bean.light} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55"/>
          <path d="M35 46 L 44 49" stroke={bean.dark} strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M56 49 L 65 46" stroke={bean.dark} strokeWidth="2.8" strokeLinecap="round"/>
          <circle cx="40" cy="55" r="3.3" fill="#fff"/>
          <circle cx="60" cy="55" r="3.3" fill="#fff"/>
          <circle cx="40.5" cy="55.5" r="1.9" fill="#000"/>
          <circle cx="60.5" cy="55.5" r="1.9" fill="#000"/>
          <ellipse cx="50" cy="68" rx="6" ry="5" fill="#5A1510"/>
          <path d="M47 70 Q50 76 53 70 Q54 67 50 67 Z" fill="#FFD93D"/>
        </g>
      );
      
      case 'stink': return (
        // Grumpy stink bean with wavy stink lines
        <g>
          {shadow}
          <path d="M34 22 Q37 17 34 12 Q37 17 40 12" stroke="#8E6F48" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M50 18 Q53 13 50 8 Q53 13 56 8" stroke="#8E6F48" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M62 22 Q65 17 62 12 Q65 17 68 12" stroke="#8E6F48" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M22 55 Q20 30 45 28 Q70 26 78 48 Q82 68 65 78 Q42 82 26 72 Q18 62 22 55 Z" fill={bean.color}/>
          <circle cx="35" cy="42" r="3" fill={bean.dark} opacity="0.5"/>
          <circle cx="68" cy="57" r="2.5" fill={bean.dark} opacity="0.5"/>
          <circle cx="50" cy="70" r="2" fill={bean.dark} opacity="0.4"/>
          <g stroke={bean.dark} strokeWidth="2.2" strokeLinecap="round">
            <line x1="36" y1="48" x2="42" y2="54"/>
            <line x1="42" y1="48" x2="36" y2="54"/>
            <line x1="58" y1="48" x2="64" y2="54"/>
            <line x1="64" y1="48" x2="58" y2="54"/>
          </g>
          <path d="M42 70 Q50 64 58 70" stroke={bean.dark} strokeWidth="2.3" fill="none" strokeLinecap="round"/>
        </g>
      );
      
      case 'green': return (
        // Cheerful sprout with leaves & big smile
        <g>
          {shadow}
          <path d="M50 24 Q42 8 36 14 Q38 20 48 26 Z" fill="#558B2F"/>
          <path d="M50 24 Q58 8 64 14 Q62 20 52 26 Z" fill="#4F7A3A"/>
          <line x1="50" y1="16" x2="50" y2="28" stroke="#355525" strokeWidth="1.2"/>
          <ellipse cx="50" cy="58" rx="30" ry="22" fill={bean.color} transform="rotate(-8 50 58)"/>
          <ellipse cx="42" cy="48" rx="13" ry="7" fill={bean.light} opacity="0.55" transform="rotate(-8 42 48)"/>
          <circle cx="40" cy="55" r="4" fill="#fff"/>
          <circle cx="60" cy="55" r="4" fill="#fff"/>
          <circle cx="40" cy="56" r="2.3" fill="#1a1a1a"/>
          <circle cx="60" cy="56" r="2.3" fill="#1a1a1a"/>
          <circle cx="41" cy="55" r="0.9" fill="#fff"/>
          <circle cx="61" cy="55" r="0.9" fill="#fff"/>
          <path d="M38 66 Q50 76 62 66" stroke={bean.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M42 68 Q50 72 58 68 L 58 69 Q 50 73 42 69 Z" fill={bean.dark} opacity="0.35"/>
          <circle cx="30" cy="64" r="3" fill="#E06356" opacity="0.45"/>
          <circle cx="70" cy="64" r="3" fill="#E06356" opacity="0.45"/>
        </g>
      );
      
      case 'soy': return (
        // Wise elder bean with round glasses
        <g>
          {shadow}
          <circle cx="50" cy="55" r="30" fill={bean.color}/>
          <ellipse cx="40" cy="42" rx="12" ry="8" fill={bean.light} opacity="0.55"/>
          <circle cx="40" cy="53" r="8" fill="#fff" opacity="0.3"/>
          <circle cx="60" cy="53" r="8" fill="#fff" opacity="0.3"/>
          <circle cx="40" cy="53" r="8" fill="none" stroke={bean.dark} strokeWidth="2.2"/>
          <circle cx="60" cy="53" r="8" fill="none" stroke={bean.dark} strokeWidth="2.2"/>
          <line x1="48" y1="53" x2="52" y2="53" stroke={bean.dark} strokeWidth="2.2"/>
          <path d="M36 54 Q40 52 44 54" stroke={bean.dark} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M56 54 Q60 52 64 54" stroke={bean.dark} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M42 68 Q45 66 48 68 Q50 69 52 68 Q55 66 58 68" stroke={bean.dark} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.65"/>
          <path d="M44 72 Q50 75 56 72" stroke={bean.dark} strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
      );
      
      case 'eye': return (
        // Big single-eye bean (the signature 'black eye')
        <g>
          {shadow}
          <ellipse cx="50" cy="55" rx="32" ry="26" fill={bean.color}/>
          <ellipse cx="38" cy="43" rx="14" ry="9" fill={bean.light} opacity="0.6"/>
          <path d="M36 38 Q50 32 64 38" stroke={bean.dark} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>
          <ellipse cx="50" cy="53" rx="16" ry="13" fill="#1a1a1a"/>
          <circle cx="54" cy="50" r="4" fill="#fff" opacity="0.95"/>
          <circle cx="46" cy="56" r="1.5" fill="#fff" opacity="0.75"/>
          <ellipse cx="50" cy="73" rx="2.5" ry="3.5" fill={bean.dark}/>
          <circle cx="28" cy="60" r="3.2" fill="#E06356" opacity="0.4"/>
          <circle cx="72" cy="60" r="3.2" fill="#E06356" opacity="0.4"/>
        </g>
      );
      
      case 'red': return (
        // Determined warrior with headband
        <g>
          {shadow}
          <ellipse cx="50" cy="58" rx="30" ry="25" fill={bean.color}/>
          <ellipse cx="40" cy="46" rx="12" ry="7" fill={bean.light} opacity="0.4"/>
          <rect x="18" y="38" width="64" height="7" rx="1.5" fill="#f5efe0"/>
          <circle cx="50" cy="41.5" r="3.2" fill="#9B2D2D"/>
          <line x1="50" y1="39" x2="50" y2="44" stroke="#fff" strokeWidth="0.9" strokeLinecap="round"/>
          <line x1="47.5" y1="41.5" x2="52.5" y2="41.5" stroke="#fff" strokeWidth="0.9" strokeLinecap="round"/>
          <path d="M18 42 Q10 44 12 50 Q18 48 22 44 Z" fill="#f5efe0"/>
          <path d="M35 50 L 44 53" stroke={bean.dark} strokeWidth="3" strokeLinecap="round"/>
          <path d="M56 53 L 65 50" stroke={bean.dark} strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="40" cy="58" rx="2.5" ry="2.3" fill={bean.dark}/>
          <ellipse cx="60" cy="58" rx="2.5" ry="2.3" fill={bean.dark}/>
          <path d="M42 69 L 56 69 Q 58 68 58 67" stroke={bean.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
      );
      
      case 'garden': return (
        // Dandy bean with monocle & curly mustache
        <g>
          {shadow}
          <ellipse cx="50" cy="55" rx="30" ry="25" fill={bean.color}/>
          <ellipse cx="40" cy="44" rx="12" ry="8" fill={bean.light} opacity="0.4"/>
          <circle cx="32" cy="62" r="2" fill={bean.dark} opacity="0.5"/>
          <circle cx="66" cy="50" r="1.6" fill={bean.dark} opacity="0.55"/>
          <circle cx="58" cy="68" r="1.8" fill={bean.dark} opacity="0.5"/>
          <circle cx="40" cy="72" r="1.3" fill={bean.light} opacity="0.85"/>
          <circle cx="72" cy="66" r="1.2" fill={bean.light} opacity="0.85"/>
          <circle cx="60" cy="52" r="9" fill="#fff" opacity="0.2"/>
          <circle cx="60" cy="52" r="9" fill="none" stroke="#d4a04a" strokeWidth="2.2"/>
          <line x1="67" y1="57" x2="73" y2="66" stroke="#d4a04a" strokeWidth="1.2"/>
          <circle cx="40" cy="52" r="2.8" fill={bean.dark}/>
          <circle cx="60" cy="52" r="2.8" fill={bean.dark}/>
          <circle cx="41" cy="51" r="0.9" fill="#fff"/>
          <circle cx="61" cy="51" r="0.9" fill="#fff"/>
          <path d="M40 65 Q43 63 46 65 Q48 67 50 65 Q52 67 54 65 Q57 63 60 65" stroke={bean.dark} strokeWidth="2.3" fill="none" strokeLinecap="round"/>
          <path d="M46 72 Q50 74 54 72" stroke={bean.dark} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75"/>
        </g>
      );
      
      default: return <circle cx="50" cy="55" r="28" fill={bean.color}/>;
    }
  };
  
  return (
    <svg 
      width={s} 
      height={s} 
      viewBox="0 0 100 100" 
      style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))', overflow: 'visible' }}
    >
      {renderChar()}
    </svg>
  );
}

// ============ BEAN CARD ============
function BeanCard({ type, size = 'md', flipped = false, className = '', highlight = false, onClick, disabled = false, style }) {
  const bean = BEAN_TYPES[type];
  const sizes = {
    xs: { w: 38, h: 54, glyph: 22, text: 'text-[8px]', pad: 'p-1' },
    sm: { w: 48, h: 68, glyph: 28, text: 'text-[9px]', pad: 'p-1' },
    md: { w: 62, h: 88, glyph: 36, text: 'text-[10px]', pad: 'p-1.5' },
    lg: { w: 78, h: 110, glyph: 48, text: 'text-xs', pad: 'p-2' },
    xl: { w: 100, h: 142, glyph: 64, text: 'text-sm', pad: 'p-2' },
  };
  const s = sizes[size];
  
  if (flipped) {
    return (
      <div
        className={`relative rounded-md card-shadow ${className}`}
        style={{ width: s.w, height: s.h, background: 'linear-gradient(135deg, #6b4e2e 0%, #8b6a40 50%, #6b4e2e 100%)', ...style }}
      >
        <div className="absolute inset-1.5 rounded border-2 border-amber-200/30 flex items-center justify-center">
          <Sprout size={s.glyph*0.6} className="text-amber-100/60" />
        </div>
      </div>
    );
  }
  
  const thresholdDisplay = bean.thresholds.map((t, i) => t === null ? null : ({ count: t, coins: i + 1 })).filter(Boolean);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-md card-shadow overflow-hidden btn-tactile ${disabled ? 'opacity-40' : ''} ${highlight ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-amber-50' : ''} ${className}`}
      style={{ 
        width: s.w, 
        height: s.h,
        background: `linear-gradient(165deg, #faf4e6 0%, #f0e6cc 100%)`,
        ...style
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle at 30% 20%, ${bean.light}22 0%, transparent 50%)`
      }}/>
      
      <div className={`relative h-full flex flex-col ${s.pad}`}>
        {/* Top: bean name */}
        <div className={`${s.text} font-body font-medium text-center leading-tight`} style={{ color: bean.dark }}>
          {bean.ko}
        </div>
        
        {/* Middle: bean visual */}
        <div className="flex-1 flex items-center justify-center">
          <BeanGlyph type={type} size={s.glyph} />
        </div>
        
        {/* Bottom: beanometer */}
        <div className="flex justify-between items-end gap-0.5">
          {thresholdDisplay.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-px">
              <div className={`${s.text} font-mono font-semibold leading-none`} style={{ color: bean.dark }}>
                {t.count}
              </div>
              <div className="relative" style={{ width: s.glyph*0.25, height: s.glyph*0.25 }}>
                <div className="absolute inset-0 rounded-full shimmer-gold"/>
                <div className="absolute inset-[1px] rounded-full flex items-center justify-center font-mono font-bold" style={{ background: '#d4a04a', color: '#5c3a0f', fontSize: s.glyph*0.14 }}>
                  {t.coins}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

// ============ COIN STACK ============
function CoinStack({ count, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5 text-[9px]', md: 'w-7 h-7 text-xs', lg: 'w-9 h-9 text-sm' };
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className={`${sizes[size]} relative rounded-full shimmer-gold flex items-center justify-center font-mono font-bold text-amber-900 card-shadow`}>
        <Coins size={size === 'sm' ? 10 : size === 'md' ? 13 : 16} strokeWidth={2.5}/>
      </div>
      <span className="font-mono font-bold text-stone-800">{count}</span>
    </div>
  );
}

// ============ FIELD ============
function Field({ field, onClick, onHarvest, canHarvest, highlight, compact = false, showHarvestButton = false, justPlanted = false }) {
  const isEmpty = !field || field.count === 0;
  const bean = isEmpty ? null : BEAN_TYPES[field.type];
  const potentialCoins = isEmpty ? 0 : coinsForField(field.type, field.count);
  
  // Compute next threshold info
  const nextThreshold = (() => {
    if (!bean) return null;
    for (let i = 0; i < bean.thresholds.length; i++) {
      const t = bean.thresholds[i];
      if (t !== null && t > field.count) {
        return { at: t, coinsAtNext: i + 1, needMore: t - field.count };
      }
    }
    return null;
  })();
  
  // All defined (non-null) thresholds for the beanometer strip
  const definedThresholds = bean ? bean.thresholds.map((t, i) => ({ at: t, coins: i + 1 })).filter(x => x.at !== null) : [];
  
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`relative w-full rounded-lg overflow-hidden border-2 transition-all btn-tactile ${
          highlight ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-100 border-amber-600' : 'border-stone-400/50'
        } ${compact ? 'h-20' : 'min-h-[128px]'} ${justPlanted ? 'field-just-planted' : ''}`}
        style={{
          background: isEmpty 
            ? 'repeating-linear-gradient(45deg, #8b7355 0 8px, #7d6749 8px 16px)'
            : `linear-gradient(170deg, ${bean.light}44 0%, ${bean.color}22 100%), #f5efe0`
        }}
      >
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-1 opacity-60 py-4">
            <Sprout size={compact ? 16 : 22} className="text-amber-100" />
            <span className="text-[10px] font-body text-amber-50 font-medium">빈 밭</span>
          </div>
        ) : compact ? (
          <>
            <div className="absolute inset-0 seed-pattern" style={{ color: bean.dark }}/>
            <div className="relative h-full flex flex-row items-center px-2 gap-2">
              <BeanGlyph type={field.type} size={28}/>
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-2xl leading-none" style={{ color: bean.dark }}>{field.count}</span>
                  <span className="text-[10px] font-body" style={{ color: bean.dark, opacity: 0.7 }}>장</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-body" style={{ color: bean.dark, opacity: 0.8 }}>{bean.ko}</span>
                  {potentialCoins > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-1 rounded-sm text-[9px] font-mono font-bold" style={{ background: '#d4a04a', color: '#5c3a0f' }}>
                      <Coins size={8}/> {potentialCoins}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 seed-pattern" style={{ color: bean.dark }}/>
            <div className="relative h-full flex flex-col py-1.5 px-2">
              {/* Top row: bean + count */}
              <div className="flex items-center gap-1.5 flex-1">
                <BeanGlyph type={field.type} size={40}/>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display font-bold text-xl leading-none" style={{ color: bean.dark }}>{field.count}</span>
                    <span className="text-[9px] font-body" style={{ color: bean.dark, opacity: 0.7 }}>장</span>
                  </div>
                  <span className="text-[9px] font-body leading-tight truncate" style={{ color: bean.dark, opacity: 0.85 }}>{bean.ko}</span>
                  {potentialCoins > 0 ? (
                    <span className="mt-0.5 inline-flex items-center gap-0.5 px-1 rounded-sm text-[9px] font-mono font-bold shimmer-gold text-amber-900">
                      <Coins size={9}/> +{potentialCoins}
                    </span>
                  ) : (
                    <span className="mt-0.5 text-[9px] font-body" style={{ color: bean.dark, opacity: 0.6 }}>금화 없음</span>
                  )}
                </div>
              </div>
              
              {/* Beanometer strip - shows all thresholds with dots */}
              <div className="mt-1 flex items-end justify-between gap-0.5 pt-1 border-t border-dashed" style={{ borderColor: `${bean.dark}40` }}>
                {definedThresholds.map((tx, i) => {
                  const reached = field.count >= tx.at;
                  const isNext = !reached && (i === 0 || field.count >= definedThresholds[i-1].at);
                  return (
                    <div key={i} className="flex flex-col items-center gap-px flex-1 min-w-0">
                      <div className={`relative flex items-center justify-center rounded-full font-mono font-bold transition-all ${
                        reached 
                          ? 'shimmer-gold text-amber-900 card-shadow' 
                          : isNext
                          ? 'bg-amber-200 text-amber-900 ring-1 ring-amber-600'
                          : 'bg-stone-300/50 text-stone-500'
                      }`} style={{ width: 14, height: 14, fontSize: 8 }}>
                        {tx.coins}
                      </div>
                      <div className="text-[8px] font-mono leading-none" style={{ color: bean.dark, opacity: reached ? 0.85 : 0.5 }}>
                        {tx.at}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Next threshold hint */}
              {nextThreshold ? (
                <div className="mt-0.5 text-center text-[9px] font-body font-semibold" style={{ color: bean.dark }}>
                  {nextThreshold.needMore}장 더 모으면 <span className="inline-flex items-center gap-0.5 px-1 rounded-sm font-mono shimmer-gold text-amber-900">+{nextThreshold.coinsAtNext}</span>
                </div>
              ) : (
                <div className="mt-0.5 text-center text-[9px] font-body font-semibold text-amber-900">
                  🎉 최대 달성
                </div>
              )}
            </div>
          </>
        )}
      </button>
      {showHarvestButton && !isEmpty && (
        <button
          onClick={(e) => { e.stopPropagation(); onHarvest?.(); }}
          disabled={!canHarvest}
          className={`absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-[10px] font-body font-semibold card-shadow btn-tactile z-10 ${
            canHarvest 
              ? 'bg-amber-600 text-white hover:bg-amber-700' 
              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
          }`}
          title={canHarvest ? '수확' : '수확 불가 (1장 필드, 다른 필드가 더 크면 수확 불가)'}
        >
          수확
        </button>
      )}
    </div>
  );
}

// ============ MINI FIELD ROW (for modals / overviews) ============
function MiniFieldRow({ player, label, dimEmpty = true }) {
  return (
    <div>
      {label && (
        <div className="text-[9px] font-body text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between px-0.5">
          <span>{label}</span>
          <span className="font-mono text-stone-400 normal-case tracking-normal">밭 {player.fields.length}</span>
        </div>
      )}
      <div className="flex gap-1">
        {player.fields.map((f, i) => {
          const isEmpty = f.count === 0;
          const bean = isEmpty ? null : BEAN_TYPES[f.type];
          const coins = isEmpty ? 0 : coinsForField(f.type, f.count);
          const nextT = bean ? bean.thresholds.find((t, idx) => t !== null && t > f.count) : null;
          return (
            <div 
              key={i} 
              className={`flex-1 min-h-[58px] rounded-lg border flex flex-col items-center justify-center p-1 text-center overflow-hidden ${isEmpty && dimEmpty ? 'opacity-60' : ''}`}
              style={{
                background: isEmpty
                  ? 'repeating-linear-gradient(45deg, #a8927055 0 4px, #9a856555 4px 8px)'
                  : `linear-gradient(170deg, ${bean.light}55 0%, ${bean.color}22 100%), #faf4e6`,
                borderColor: isEmpty ? '#8b7355' : `${bean.dark}40`,
              }}
            >
              {isEmpty ? (
                <Sprout size={14} className="text-amber-100"/>
              ) : (
                <>
                  <BeanGlyph type={f.type} size={24}/>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="font-display font-bold text-base leading-none" style={{ color: bean.dark }}>{f.count}</span>
                    <span className="text-[8px] font-body" style={{ color: bean.dark, opacity: 0.7 }}>장</span>
                  </div>
                  {coins > 0 ? (
                    <span className="text-[8px] font-mono font-bold px-1 rounded shimmer-gold text-amber-900">+{coins}</span>
                  ) : nextT ? (
                    <span className="text-[8px] font-body text-stone-600">→{nextT}</span>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ COLLAPSIBLE HAND VIEWER ============
function CollapsibleHand({ player, label, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  if (player.hand.length === 0) return null;
  return (
    <div className="rounded-lg bg-stone-100 overflow-hidden border border-stone-200">
      <button 
        onClick={() => { setOpen(!open); haptic('light'); }}
        className="w-full px-2 py-1.5 flex items-center justify-between text-xs font-body text-stone-700 btn-tactile hover:bg-stone-200"
      >
        <span className="flex items-center gap-1.5">
          <ChevronRight size={12} className={`transition-transform ${open ? 'rotate-90' : ''}`}/>
          {label} <span className="text-stone-400 text-[11px]">({player.hand.length}장)</span>
        </span>
        <span className="text-[10px] text-stone-500">{open ? '접기' : '펼치기'}</span>
      </button>
      {open && (
        <div className="p-2 flex gap-1 flex-wrap bg-white/50">
          {player.hand.map((c, i) => (
            <div key={c.id} className={i === 0 ? 'relative' : ''}>
              {i === 0 && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 px-1 rounded-sm bg-amber-700 text-amber-50 text-[7px] font-body font-bold whitespace-nowrap">맨앞</div>
              )}
              <BeanCard type={c.type} size="xs"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ HAND (ORDER LOCKED) ============
function Hand({ cards, onPlant, plantableIndices = [], phase, size = 'md' }) {
  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center py-4 text-stone-500 font-body text-sm">
        손패가 비었습니다
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between text-[9px] font-body text-stone-500 px-1 mb-0.5">
        <span className="flex items-center gap-0.5"><ChevronRight size={10} className="rotate-180"/> 뒷쪽 · 새 카드 들어옴</span>
        <span className="flex items-center gap-0.5">앞쪽 · 심을 카드 <ChevronRight size={10}/></span>
      </div>
      <div className="flex items-end gap-1 overflow-x-auto hide-scrollbar px-1 pb-1 pt-3">
        {cards.map((card, i) => {
          const plantable = plantableIndices.includes(i);
          const isFront = i === 0;
          return (
            <div
              key={card.id}
              className="relative flex-shrink-0 slide-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {isFront && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 whitespace-nowrap">
                  <div className="px-1.5 py-0.5 rounded-sm bg-amber-700 text-amber-50 text-[9px] font-body font-bold uppercase tracking-wider">
                    맨앞 ↓
                  </div>
                </div>
              )}
              <BeanCard
                type={card.type}
                size={size}
                onClick={plantable ? () => onPlant(i) : undefined}
                disabled={!plantable}
                highlight={plantable && isFront}
                className={plantable && isFront ? 'breathe' : ''}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ OPPONENT PANEL ============
function OpponentPanel({ player, isCurrentTurn, onClick, highlighted, onTradeOffer }) {
  const difficultyBadge = {
    easy: { label: '초급', color: 'bg-emerald-100 text-emerald-700' },
    normal: { label: '중급', color: 'bg-amber-100 text-amber-700' },
    hard: { label: '고급', color: 'bg-rose-100 text-rose-700' },
  }[player.difficulty || 'normal'];
  
  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full rounded-xl p-3 card-shadow transition-all btn-tactile ${
        highlighted ? 'ring-2 ring-amber-500 bg-amber-50' : isCurrentTurn ? 'bg-amber-50 ring-1 ring-amber-400' : 'bg-[#faf4e6]'
      }`}
    >
      {isCurrentTurn && (
        <div className="absolute -top-2 -right-2 breathe">
          <div className="rounded-full bg-amber-600 text-amber-50 text-[9px] font-bold px-2 py-0.5 font-body">차례</div>
        </div>
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: player.color }}>
            {player.avatar}
          </div>
          <div className="min-w-0">
            <div className="font-body font-semibold text-sm truncate" style={{ color: '#3a2e1e' }}>{player.name}</div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] px-1 rounded font-body font-medium ${difficultyBadge.color}`}>
                {difficultyBadge.label}
              </span>
              <span className="text-[10px] font-mono text-stone-500">손:{player.hand.length}</span>
            </div>
          </div>
        </div>
        <CoinStack count={player.coins.length} size="sm"/>
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {player.fields.map((f, i) => {
          const isEmpty = f.count === 0;
          const bean = isEmpty ? null : BEAN_TYPES[f.type];
          const coins = isEmpty ? 0 : coinsForField(f.type, f.count);
          // Next threshold relative to current count
          const nextT = bean ? bean.thresholds.find((t, idx) => t !== null && t > f.count) : null;
          const nextCoins = bean && nextT ? bean.thresholds.indexOf(nextT) + 1 : null;
          const almostThere = nextT && (nextT - f.count <= 2); // highlight if close
          return (
            <div
              key={i}
              className={`relative h-[60px] rounded border flex flex-col items-center justify-center overflow-hidden p-0.5 ${
                almostThere ? 'border-amber-600 ring-1 ring-amber-500' : 'border-stone-400/40'
              }`}
              style={{
                background: isEmpty
                  ? 'repeating-linear-gradient(45deg, #a8927080 0 4px, #9a856580 4px 8px)'
                  : `linear-gradient(170deg, ${bean.light}66 0%, ${bean.color}33 100%), #f5efe0`
              }}
            >
              {isEmpty ? (
                <Sprout size={14} className="text-amber-200/60"/>
              ) : (
                <>
                  <div className="flex items-center gap-0.5">
                    <BeanGlyph type={f.type} size={20}/>
                    <span className="font-display font-bold text-base leading-none" style={{ color: bean.dark }}>{f.count}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {coins > 0 && (
                      <span className="inline-flex items-center font-mono font-bold text-[8px] px-1 rounded-sm shimmer-gold text-amber-900 leading-none">
                        +{coins}
                      </span>
                    )}
                    {nextT && (
                      <span className={`inline-flex items-center text-[8px] font-mono font-semibold px-1 rounded-sm leading-none ${
                        almostThere ? 'bg-amber-200 text-amber-900' : 'bg-stone-200/70 text-stone-600'
                      }`}>
                        →{nextT}({nextCoins})
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {onTradeOffer && (
        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-body font-semibold text-amber-50 bg-amber-700 rounded-lg py-1.5 px-2 breathe">
          <Gift size={11}/> 탭하여 거래 제안하기
        </div>
      )}
    </button>
  );
}

// ============ CPU AI ============
// Evaluates how valuable a given bean type is for a player
function evaluateBeanForPlayer(player, beanType, difficulty) {
  const field = player.fields.find(f => f.type === beanType);
  const emptyFields = player.fields.filter(f => f.count === 0).length;
  const { thresholds } = BEAN_TYPES[beanType];
  const maxThreshold = Math.max(...thresholds.filter(t => t !== null));
  
  // If player already has this bean in a field, very valuable
  if (field) {
    const currentCoins = coinsForField(beanType, field.count);
    const nextCoins = coinsForField(beanType, field.count + 1);
    const boost = nextCoins > currentCoins ? 3 : 1.5;
    // closer to next threshold, even more valuable
    const nextT = thresholds.find((t, i) => t !== null && field.count < t);
    const distance = nextT ? nextT - field.count : 5;
    return 5 + boost + Math.max(0, 3 - distance);
  }
  
  // No field for this bean yet
  if (emptyFields === 0) {
    // would force a harvest - negative value
    return -2;
  }
  
  // Base value depends on rarity/max coins
  const base = BEAN_TYPES[beanType].thresholds.filter(t => t !== null).length; // more thresholds = more valuable
  return base - (difficulty === 'hard' ? 0 : 1);
}

function cpuDecidePlantFromHand(player, difficulty) {
  // Must plant front card. Decide if we plant second card too.
  if (player.hand.length < 1) return { plantFirst: false, plantSecond: false };
  
  const firstBean = player.hand[0].type;
  const fieldWithFirst = player.fields.find(f => f.type === firstBean);
  
  // Always plant first (required)
  let plantSecond = false;
  if (player.hand.length >= 2) {
    const secondBean = player.hand[1].type;
    const fieldWithSecond = player.fields.find(f => f.type === secondBean);
    const hasSpace = player.fields.filter(f => f.count === 0).length > 0;
    
    if (fieldWithSecond) {
      // Same bean in a field -> great, plant it
      plantSecond = true;
    } else if (secondBean === firstBean) {
      plantSecond = true;
    } else if (difficulty === 'hard' && !hasSpace && !fieldWithSecond) {
      // Hard AI avoids forced harvests
      plantSecond = false;
    } else if (difficulty === 'easy') {
      plantSecond = Math.random() < 0.3;
    }
  }
  
  return { plantFirst: true, plantSecond };
}

// CPU decides which field to harvest when forced
function cpuChooseForceHarvest(player) {
  // Pick the field giving most coins (or the smallest if all give 0)
  let best = 0, bestCoins = -1;
  player.fields.forEach((f, i) => {
    if (f.count === 0) return;
    const c = coinsForField(f.type, f.count);
    if (c > bestCoins || (c === bestCoins && f.count < player.fields[best].count)) {
      best = i;
      bestCoins = c;
    }
  });
  return best;
}

// CPU voluntary harvest during plant phase: if any field is at threshold, consider harvesting
function cpuConsiderVoluntaryHarvest(player, difficulty) {
  if (difficulty === 'easy') return null;
  const candidates = [];
  player.fields.forEach((f, i) => {
    if (f.count === 0) return;
    if (!canHarvestField(player.fields, i, false)) return;
    const c = coinsForField(f.type, f.count);
    const nextT = BEAN_TYPES[f.type].thresholds.find(t => t !== null && f.count < t);
    // Worth harvesting if we're at a threshold and far from next
    if (c > 0 && (!nextT || nextT - f.count >= 3)) {
      candidates.push({ idx: i, coins: c });
    }
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.coins - a.coins);
  return candidates[0].idx;
}

// CPU evaluates a proposed trade: does it benefit me?
function cpuEvaluateTrade(player, giving, receiving, difficulty) {
  const givingValue = giving.reduce((sum, t) => sum + evaluateBeanForPlayer(player, t, difficulty), 0);
  const receivingValue = receiving.reduce((sum, t) => sum + evaluateBeanForPlayer(player, t, difficulty), 0);
  const net = receivingValue - givingValue;
  
  if (difficulty === 'easy') {
    // easy AI accepts with lower threshold, some randomness
    return net + Math.random() * 3 > 0;
  } else if (difficulty === 'normal') {
    return net > 0.5;
  } else {
    return net > 1.5; // hard AI is pickier
  }
}

// CPU initiates trades during its trade phase
function cpuProposeTrade(player, flipped, otherPlayers, difficulty) {
  // Try to offload flipped cards we don't want; try to acquire cards we want
  const proposals = [];
  
  for (const flipCard of flipped) {
    const myValue = evaluateBeanForPlayer(player, flipCard.type, difficulty);
    if (myValue > 3) continue; // we actually want it
    
    for (const other of otherPlayers) {
      const theirValue = evaluateBeanForPlayer(other, flipCard.type, difficulty);
      if (theirValue < 1) continue;
      
      // Find something to ask for
      for (let i = 0; i < Math.min(other.hand.length, 4); i++) {
        const handCard = other.hand[i];
        const myWant = evaluateBeanForPlayer(player, handCard.type, difficulty);
        const theirKeep = evaluateBeanForPlayer(other, handCard.type, difficulty);
        if (myWant > theirKeep + 0.5) {
          proposals.push({
            target: other.id,
            give: [{ source: 'flipped', id: flipCard.id }],
            want: [{ source: 'hand', id: handCard.id }],
            score: (myWant - theirKeep) + (theirValue - myValue),
          });
        }
      }
      // Or just gift it
      if (theirValue >= 2 && myValue <= 0) {
        proposals.push({
          target: other.id,
          give: [{ source: 'flipped', id: flipCard.id }],
          want: [],
          score: theirValue - myValue - 1, // slightly negative incentive to gift
          isGift: true,
        });
      }
    }
  }
  
  proposals.sort((a, b) => b.score - a.score);
  return proposals.slice(0, 3); // return top 3 ideas
}

// ============ TRADE MODAL ============
function TradeModal({ open, onClose, currentPlayer, targetPlayer, flippedCards, onExecute }) {
  const [myOffer, setMyOffer] = useState([]);
  const [theirAsk, setTheirAsk] = useState([]);
  
  useEffect(() => {
    if (open) {
      setMyOffer([]);
      setTheirAsk([]);
    }
  }, [open, targetPlayer?.id]);
  
  if (!open || !targetPlayer) return null;
  
  const isInOffer = (source, id) => myOffer.some(o => o.source === source && o.id === id);
  const isInAsk = (id) => theirAsk.some(a => a.id === id);
  
  const toggleMyOffer = (source, card) => {
    if (isInOffer(source, card.id)) {
      setMyOffer(myOffer.filter(o => !(o.source === source && o.id === card.id)));
    } else {
      setMyOffer([...myOffer, { source, id: card.id }]);
    }
    haptic('light');
  };
  
  const toggleTheirAsk = (card) => {
    if (isInAsk(card.id)) {
      setTheirAsk(theirAsk.filter(a => a.id !== card.id));
    } else {
      setTheirAsk([...theirAsk, { id: card.id }]);
    }
    haptic('light');
  };
  
  const handlePropose = () => {
    if (myOffer.length === 0 && theirAsk.length === 0) return;
    onExecute({ targetPlayerId: targetPlayer.id, give: myOffer, want: theirAsk });
  };
  
  // Derive selected card objects for preview
  const offerCards = myOffer.map(o => {
    if (o.source === 'flipped') return flippedCards.find(c => c.id === o.id);
    return currentPlayer.hand.find(c => c.id === o.id);
  }).filter(Boolean);
  const askCards = theirAsk.map(a => targetPlayer.hand.find(c => c.id === a.id)).filter(Boolean);
  
  const offerIsGift = myOffer.length > 0 && theirAsk.length === 0;
  const askOnly = myOffer.length === 0 && theirAsk.length > 0;
  const nothing = myOffer.length === 0 && theirAsk.length === 0;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl bg-[#f5efe0] paper-texture max-h-[92vh] overflow-y-auto slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with both avatars */}
        <div className="sticky top-0 bg-[#f5efe0]/98 backdrop-blur-sm border-b border-stone-300 z-10">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="font-display text-base font-bold" style={{ color: '#3a2e1e' }}>거래 제안</div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-200 btn-tactile">
              <X size={16}/>
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 pb-3">
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white text-sm card-shadow" style={{ background: currentPlayer.color }}>
                {currentPlayer.avatar}
              </div>
              <div className="text-xs font-body font-semibold mt-1" style={{ color: '#3a2e1e' }}>{currentPlayer.name}</div>
              <div className="text-[9px] font-body text-stone-500">나</div>
            </div>
            <div className="flex flex-col items-center px-2">
              <div className="flex flex-col gap-0.5">
                <ArrowRight size={14} className="text-amber-700"/>
                <ArrowRight size={14} className="text-amber-700 rotate-180"/>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white text-sm card-shadow" style={{ background: targetPlayer.color }}>
                {targetPlayer.avatar}
              </div>
              <div className="text-xs font-body font-semibold mt-1" style={{ color: '#3a2e1e' }}>{targetPlayer.name}</div>
              <div className="text-[9px] font-body text-stone-500">상대</div>
            </div>
          </div>
        </div>
        
        <div className="p-3 space-y-3">
          {/* Context: both players' fields */}
          <div className="bg-stone-50 rounded-xl p-2 border border-stone-200 space-y-1.5">
            <div className="text-[9px] font-body text-stone-500 uppercase tracking-wider text-center">
              💡 양쪽 밭 상황
            </div>
            <MiniFieldRow player={currentPlayer} label="내 밭"/>
            <MiniFieldRow player={targetPlayer} label={`${targetPlayer.name}의 밭`}/>
          </div>
          
          {/* LIVE DEAL PREVIEW */}
          <div className={`rounded-xl p-3 border-2 ${nothing ? 'border-dashed border-stone-300 bg-stone-50' : 'border-amber-500 bg-amber-50 card-shadow'}`}>
            <div className="text-[10px] font-body text-stone-600 uppercase tracking-wider mb-2 text-center">
              {nothing ? '아래에서 카드를 선택하세요' : offerIsGift ? '🎁 선물 제안' : askOnly ? '요청만 하는 제안' : '맞교환 제안'}
            </div>
            <div className="flex items-stretch gap-2">
              {/* Left: I give */}
              <div className="flex-1">
                <div className="text-[9px] font-body text-stone-500 uppercase tracking-wider mb-1 text-center">내가 줌</div>
                <div className="min-h-[70px] flex items-center justify-center flex-wrap gap-1 p-2 rounded-lg bg-white/60 border border-stone-200">
                  {offerCards.length === 0 ? (
                    <span className="text-[10px] font-body text-stone-400">비어있음</span>
                  ) : offerCards.map((c, i) => (
                    <div key={i} className="pop-in"><BeanCard type={c.type} size="xs"/></div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <ArrowRight size={18} className="text-amber-700"/>
                <div className="w-px h-4 bg-amber-300 my-0.5"/>
                <ArrowRight size={18} className="text-amber-700 rotate-180"/>
              </div>
              {/* Right: I receive */}
              <div className="flex-1">
                <div className="text-[9px] font-body text-stone-500 uppercase tracking-wider mb-1 text-center">내가 받음</div>
                <div className="min-h-[70px] flex items-center justify-center flex-wrap gap-1 p-2 rounded-lg bg-white/60 border border-stone-200">
                  {askCards.length === 0 ? (
                    <span className="text-[10px] font-body text-stone-400">비어있음</span>
                  ) : askCards.map((c, i) => (
                    <div key={i} className="pop-in"><BeanCard type={c.type} size="xs"/></div>
                  ))}
                </div>
              </div>
            </div>
            {offerIsGift && (
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-amber-800 bg-amber-200/50 rounded-full px-2 py-1 font-body">
                <Gift size={11}/> 선물로 제안 · 상대가 거절할 수도 있음
              </div>
            )}
          </div>
          
          {/* PICKER: cards I can offer */}
          <section>
            <div className="font-body text-xs font-semibold text-stone-700 mb-1.5 px-1 flex items-center gap-1.5">
              <span className="inline-block w-5 h-5 rounded-full bg-amber-700 text-amber-50 text-[10px] font-bold flex items-center justify-center">1</span>
              줄 카드 고르기
            </div>
            {flippedCards.length > 0 && (
              <div className="mb-2">
                <div className="text-[9px] font-body text-amber-800 mb-1 px-1 uppercase tracking-wider flex items-center gap-1">
                  <Shuffle size={9}/> 시장 카드
                </div>
                <div className="flex gap-1 flex-wrap px-1">
                  {flippedCards.map(c => (
                    <BeanCard
                      key={c.id}
                      type={c.type}
                      size="sm"
                      onClick={() => toggleMyOffer('flipped', c)}
                      highlight={isInOffer('flipped', c.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-[9px] font-body text-stone-600 mb-1 px-1 uppercase tracking-wider">내 손패</div>
              {currentPlayer.hand.length === 0 ? (
                <div className="text-[10px] font-body text-stone-400 px-1">손패 없음</div>
              ) : (
                <div className="flex gap-1 flex-wrap px-1">
                  {currentPlayer.hand.map(c => (
                    <BeanCard
                      key={c.id}
                      type={c.type}
                      size="sm"
                      onClick={() => toggleMyOffer('hand', c)}
                      highlight={isInOffer('hand', c.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
          
          {/* PICKER: cards from target */}
          <section>
            <div className="font-body text-xs font-semibold text-stone-700 mb-1.5 px-1 flex items-center gap-1.5">
              <span className="inline-block w-5 h-5 rounded-full bg-amber-700 text-amber-50 text-[10px] font-bold flex items-center justify-center">2</span>
              {targetPlayer.name}에게서 받을 카드
            </div>
            {targetPlayer.hand.length === 0 ? (
              <div className="text-[10px] font-body text-stone-400 px-1">상대 손패가 비어있음</div>
            ) : (
              <div className="flex gap-1 flex-wrap px-1">
                {targetPlayer.hand.map(c => (
                  <BeanCard
                    key={c.id}
                    type={c.type}
                    size="sm"
                    onClick={() => toggleTheirAsk(c)}
                    highlight={isInAsk(c.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
        
        <div className="sticky bottom-0 bg-[#f5efe0]/98 backdrop-blur-sm border-t border-stone-300 p-3 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-stone-200 font-body font-semibold text-stone-700 btn-tactile"
          >
            취소
          </button>
          <button
            onClick={handlePropose}
            disabled={nothing}
            className={`flex-[2] py-3 rounded-xl font-body font-bold btn-tactile ${
              nothing ? 'bg-stone-300 text-stone-500' : 'bg-amber-700 text-amber-50 card-shadow'
            }`}
          >
            {offerIsGift ? '선물하기' : '제안하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ HAPTIC ============
function haptic(kind = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  const patterns = {
    light: 10,
    medium: 20,
    heavy: [0, 15, 30, 15],
    success: [0, 20, 40, 40],
    error: [0, 40, 40, 40],
  };
  try { navigator.vibrate(patterns[kind] || 10); } catch {}
}

// ============ SETUP SCREEN ============
function SetupScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(4);
  const [difficulty, setDifficulty] = useState('normal');
  const [playerName, setPlayerName] = useState('나');
  
  return (
    <div className="min-h-screen paper-texture flex flex-col items-center justify-center p-4" style={{ background: '#f5efe0' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8 pop-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-4">
            <Sprout size={14} className="text-amber-700"/>
            <span className="font-body text-xs font-semibold text-amber-900 tracking-wide uppercase">콩 농장 카드 게임</span>
          </div>
          <h1 className="font-display font-bold text-6xl leading-none mb-2" style={{ color: '#3a2e1e' }}>보난자</h1>
          <div className="font-display italic text-lg text-stone-600">Bohnanza</div>
        </div>
        
        <div className="bg-[#faf4e6] rounded-2xl p-5 card-shadow-lg space-y-5 slide-up" style={{ animationDelay: '150ms' }}>
          <div>
            <label className="block font-body text-sm font-semibold mb-2" style={{ color: '#3a2e1e' }}>
              <Users size={14} className="inline mr-1"/>
              플레이어 수 <span className="text-stone-500 font-normal">(나 포함)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => { setPlayerCount(n); haptic('light'); }}
                  className={`py-3 rounded-xl font-display text-xl font-bold btn-tactile transition-all ${
                    playerCount === n 
                      ? 'bg-amber-700 text-amber-50 card-shadow' 
                      : 'bg-stone-100 text-stone-500 border border-stone-300'
                  }`}
                >
                  {n}명
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block font-body text-sm font-semibold mb-2" style={{ color: '#3a2e1e' }}>
              CPU 난이도
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'easy', label: '초급', desc: '랜덤 거래', color: 'emerald' },
                { v: 'normal', label: '중급', desc: '합리적', color: 'amber' },
                { v: 'hard', label: '고급', desc: '냉정함', color: 'rose' },
              ].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => { setDifficulty(opt.v); haptic('light'); }}
                  className={`p-3 rounded-xl btn-tactile transition-all ${
                    difficulty === opt.v 
                      ? `bg-${opt.color}-600 text-white card-shadow`
                      : 'bg-stone-100 text-stone-500 border border-stone-300'
                  }`}
                  style={difficulty === opt.v ? {
                    background: opt.color === 'emerald' ? '#059669' : opt.color === 'amber' ? '#b45309' : '#e11d48',
                    color: '#fff'
                  } : {}}
                >
                  <div className="font-body font-bold text-sm">{opt.label}</div>
                  <div className="text-[10px] font-body opacity-80 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block font-body text-sm font-semibold mb-2" style={{ color: '#3a2e1e' }}>
              내 이름
            </label>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 10))}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-300 font-body focus:outline-none focus:border-amber-600 focus:bg-amber-50/50"
              placeholder="이름"
            />
          </div>
          
          <button
            onClick={() => { haptic('success'); onStart({ playerCount, difficulty, playerName: playerName.trim() || '나' }); }}
            className="w-full py-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-amber-50 font-display text-lg font-bold card-shadow btn-tactile flex items-center justify-center gap-2"
          >
            게임 시작
            <ChevronRight size={20}/>
          </button>
        </div>
        
        <div className="mt-6 text-center text-xs font-body text-stone-500 leading-relaxed">
          <p className="mb-1">콩 농부가 되어 밭에 콩을 심고 수확해 금화를 모으세요.</p>
          <p>손패 순서를 바꿀 수 없다는 규칙이 핵심입니다.</p>
        </div>
      </div>
    </div>
  );
}

// ============ GAME LOGIC ============
// Phases: 'plant1' (must plant front), 'plant2' (optional second), 'reveal', 'trade', 'plantFaceUp', 'draw'
const INITIAL_HAND_SIZE = { 3: 5, 4: 5, 5: 4, 6: 4, 7: 4 };
const DRAW_PER_TURN = 3;
const MAX_DECK_RESHUFFLES = 2; // Game ends after the 3rd deck exhaustion (2 reshuffles then empty)

const CPU_NAMES = ['한나', '민준', '수지', '도윤', '지아', '서진', '유나', '태오'];
const CPU_AVATARS = ['한', '민', '수', '도', '지', '서', '유', '태'];
const PLAYER_COLORS = ['#8B5A3C', '#2E5090', '#558B2F', '#9B2D2D', '#7B4A9B'];

function makeInitialState({ playerCount, difficulty, playerName }) {
  const deck = createDeck();
  const handSize = INITIAL_HAND_SIZE[playerCount];
  const fieldCount = playerCount === 3 ? 3 : 2;
  const makeFields = () => Array.from({ length: fieldCount }, () => ({ type: null, count: 0 }));
  const shuffledCPU = shuffle(CPU_NAMES.map((n, i) => ({ name: n, avatar: CPU_AVATARS[i] })));
  
  const players = [];
  players.push({
    id: 0,
    name: playerName,
    isHuman: true,
    avatar: '나',
    color: PLAYER_COLORS[0],
    difficulty: 'human',
    hand: [],
    fields: makeFields(),
    coins: [],
  });
  for (let i = 1; i < playerCount; i++) {
    const cpu = shuffledCPU[i - 1];
    players.push({
      id: i,
      name: cpu.name,
      avatar: cpu.avatar,
      isHuman: false,
      color: PLAYER_COLORS[i],
      difficulty,
      hand: [],
      fields: makeFields(),
      coins: [],
    });
  }
  
  // Deal initial hands
  let d = [...deck];
  for (let r = 0; r < handSize; r++) {
    for (const p of players) {
      p.hand.push(d.shift());
    }
  }
  
  return {
    players,
    deck: d,
    discard: [],
    flippedCards: [],
    currentPlayerIdx: 0,
    phase: 'plant1',
    reshuffles: 0,
    gameOver: false,
    logs: [{ id: Date.now(), text: `게임 시작! ${playerCount}명의 농부가 콩밭을 일굽니다.`, type: 'info' }],
    pendingTradeProposal: null,
    receivedTrades: {},
  };
}

// ============ MAIN GAME ============
function GameScreen({ config, onExit }) {
  const [state, setState] = useState(() => makeInitialState(config));
  const [selectedFieldIdx, setSelectedFieldIdx] = useState(null);
  const [pendingPlantCard, setPendingPlantCard] = useState(null);
  const [tradeTargetIdx, setTradeTargetIdx] = useState(null);
  const [incomingTrade, setIncomingTrade] = useState(null); // CPU->human trade proposal
  const [harvestPrompt, setHarvestPrompt] = useState(null);
  const [showRulebook, setShowRulebook] = useState(false);
  const [showBoardOverview, setShowBoardOverview] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeAction, setActiveAction] = useState(null); // { kind: 'plant'|'trade'|'reveal', ... }
  const [recentPlanted, setRecentPlanted] = useState(null); // { playerId, fieldIdx, stamp }
  
  // Auto-clear recent-planted flash
  useEffect(() => {
    if (!recentPlanted) return;
    const stamp = recentPlanted.stamp;
    const t = setTimeout(() => {
      setRecentPlanted(cur => (cur && cur.stamp === stamp) ? null : cur);
    }, 900);
    return () => clearTimeout(t);
  }, [recentPlanted]);
  
  const flashField = (playerId, fieldIdx) => {
    setRecentPlanted({ playerId, fieldIdx, stamp: Date.now() + Math.random() });
  };
  
  const currentPlayer = state.players[state.currentPlayerIdx];
  const humanPlayer = state.players[0];
  const isHumanTurn = currentPlayer.id === 0;
  
  const showToast = (text, type = 'info') => {
    setToast({ text, type, id: Date.now() });
    setTimeout(() => setToast(null), 2200);
  };
  
  const addLog = (text, type = 'info') => {
    setState(s => ({ ...s, logs: [...s.logs.slice(-20), { id: Date.now() + Math.random(), text, type }] }));
  };
  
  // Draw N cards, handling reshuffles and game end
  const drawCards = (state, n) => {
    let { deck, discard, reshuffles, gameOver } = state;
    const drawn = [];
    for (let i = 0; i < n; i++) {
      if (deck.length === 0) {
        if (reshuffles >= MAX_DECK_RESHUFFLES) {
          gameOver = true;
          break;
        }
        deck = shuffle(discard);
        discard = [];
        reshuffles += 1;
      }
      drawn.push(deck.shift());
    }
    return { drawn, deck, discard, reshuffles, gameOver };
  };
  
  // Plant a card at given field idx (for a player), may require harvest first
  const plantCard = (players, playerId, fieldIdx, card, discard) => {
    const newPlayers = players.map(p => p.id === playerId ? ({ ...p, fields: p.fields.map(f => ({ ...f })), coins: [...p.coins] }) : p);
    const p = newPlayers.find(x => x.id === playerId);
    let newDiscard = [...discard];
    const field = p.fields[fieldIdx];
    
    if (field.count === 0) {
      field.type = card.type;
      field.count = 1;
    } else if (field.type === card.type) {
      field.count += 1;
    } else {
      // harvest first
      const coins = coinsForField(field.type, field.count);
      // Extra cards (non-coin cards) go back to discard
      const kept = coins; // cards kept as coins
      const toDiscard = field.count - kept;
      for (let i = 0; i < toDiscard; i++) {
        newDiscard.push({ id: Math.random(), type: field.type });
      }
      // coins
      for (let i = 0; i < coins; i++) {
        p.coins.push({ id: Math.random(), type: field.type });
      }
      field.type = card.type;
      field.count = 1;
    }
    return { players: newPlayers, discard: newDiscard };
  };
  
  // Find best field idx to plant a card in (for human: prompt; for CPU: auto)
  const findBestFieldForCard = (player, cardType) => {
    // 1. Field with same bean
    let idx = player.fields.findIndex(f => f.type === cardType);
    if (idx >= 0) return { idx, forcedHarvest: false };
    // 2. Empty field
    idx = player.fields.findIndex(f => f.count === 0);
    if (idx >= 0) return { idx, forcedHarvest: false };
    // 3. Forced harvest: pick smallest coins loss
    let best = 0, worstCoins = Infinity;
    player.fields.forEach((f, i) => {
      const c = coinsForField(f.type, f.count);
      if (c < worstCoins) { worstCoins = c; best = i; }
    });
    return { idx: best, forcedHarvest: true };
  };
  
  // Harvest a specific field
  const harvestField = (players, playerId, fieldIdx, discard, force = false) => {
    const p = players.find(x => x.id === playerId);
    if (!canHarvestField(p.fields, fieldIdx, force)) return { players, discard, coinsGained: 0 };
    const newPlayers = players.map(p => p.id === playerId ? ({ ...p, fields: p.fields.map(f => ({ ...f })), coins: [...p.coins] }) : p);
    const np = newPlayers.find(x => x.id === playerId);
    const field = np.fields[fieldIdx];
    const coins = coinsForField(field.type, field.count);
    const toDiscard = field.count - coins;
    const newDiscard = [...discard];
    const harvestType = field.type;
    for (let i = 0; i < toDiscard; i++) newDiscard.push({ id: Math.random(), type: harvestType });
    for (let i = 0; i < coins; i++) np.coins.push({ id: Math.random(), type: harvestType });
    field.type = null;
    field.count = 0;
    return { players: newPlayers, discard: newDiscard, coinsGained: coins };
  };
  
  // ============ Phase: Plant ============
  const handlePlantFromHand = (idx) => {
    if (!isHumanTurn) return;
    if (state.phase !== 'plant1' && state.phase !== 'plant2') return;
    if (idx !== 0) return; // must plant from front only (in plant1 & plant2)
    
    const card = humanPlayer.hand[0];
    const { idx: bestIdx, forcedHarvest } = findBestFieldForCard(humanPlayer, card.type);
    
    if (forcedHarvest) {
      // Prompt which field to sacrifice
      setHarvestPrompt({
        card,
        onChoose: (fieldIdx) => {
          doPlantFromHand(card, fieldIdx);
          setHarvestPrompt(null);
        },
      });
      return;
    }
    
    doPlantFromHand(card, bestIdx);
  };
  
  const doPlantFromHand = (card, fieldIdx) => {
    setState(s => {
      const newHand = s.players[0].hand.slice(1);
      const { players: afterPlant, discard: newDiscard } = plantCard(s.players, 0, fieldIdx, card, s.discard);
      const updated = afterPlant.map(p => p.id === 0 ? { ...p, hand: newHand } : p);
      const nextPhase = s.phase === 'plant1' ? 'plant2' : 'reveal';
      return { ...s, players: updated, discard: newDiscard, phase: nextPhase };
    });
    flashField(0, fieldIdx);
    addLog(`${BEAN_TYPES[card.type].ko}을(를) 심었습니다.`, 'plant');
    haptic('medium');
  };
  
  const handleSkipSecondPlant = () => {
    setState(s => ({ ...s, phase: 'reveal' }));
  };
  
  // ============ Phase: Reveal ============
  useEffect(() => {
    if (state.phase === 'reveal' && !state.gameOver) {
      const t = setTimeout(() => {
        setState(s => {
          const { drawn, deck, discard, reshuffles, gameOver } = drawCards(s, 2);
          if (gameOver && drawn.length === 0) {
            return { ...s, phase: 'ended', gameOver: true };
          }
          return {
            ...s,
            flippedCards: drawn,
            deck, discard, reshuffles, gameOver,
            phase: 'trade',
            logs: [...s.logs.slice(-20), { id: Date.now(), text: `${s.players[s.currentPlayerIdx].name}의 시장에 ${drawn.map(c => BEAN_TYPES[c.type].ko).join(', ')}이(가) 펼쳐졌습니다.`, type: 'reveal' }],
          };
        });
        haptic('light');
      }, 500);
      return () => clearTimeout(t);
    }
  }, [state.phase]);
  
  // Safety: if current player's hand is empty during plant phases, skip forward
  useEffect(() => {
    if (state.phase !== 'plant1' && state.phase !== 'plant2') return;
    const cp = state.players[state.currentPlayerIdx];
    if (cp.hand.length === 0) {
      const t = setTimeout(() => {
        setState(s => {
          if ((s.phase !== 'plant1' && s.phase !== 'plant2')) return s;
          if (s.players[s.currentPlayerIdx].hand.length > 0) return s;
          return { ...s, phase: 'reveal' };
        });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state.phase, state.currentPlayerIdx, state.players]);
  
  // ============ Phase: Trade ============
  // Human opens trade modal
  const handleOpenTrade = (targetIdx) => {
    if (!isHumanTurn || state.phase !== 'trade') return;
    if (targetIdx === 0) return;
    setTradeTargetIdx(targetIdx);
  };
  
  const handleExecuteTrade = ({ targetPlayerId, give, want }) => {
    const target = state.players.find(p => p.id === targetPlayerId);
    // CPU evaluates the deal
    const giveTypes = give.map(g => {
      if (g.source === 'flipped') return state.flippedCards.find(c => c.id === g.id).type;
      return humanPlayer.hand.find(c => c.id === g.id).type;
    });
    const wantTypes = want.map(w => target.hand.find(c => c.id === w.id).type);
    // Gifts are evaluated normally by CPU — recipient has the right to refuse.
    const isGift = want.length === 0 && give.length > 0;
    const accepts = cpuEvaluateTrade(target, wantTypes, giveTypes, target.difficulty);
    
    if (!accepts) {
      addLog(`${target.name}이(가) 거래를 거절했습니다.`, 'error');
      showToast(`${target.name} 거절`, 'error');
      haptic('error');
      setTradeTargetIdx(null);
      return;
    }
    
    executeTradeBetween({
      fromId: 0,
      toId: targetPlayerId,
      give,
      want,
    });
    addLog(isGift ? `${target.name}에게 선물!` : `${target.name}과(와) 거래 성사!`, 'success');
    showToast(isGift ? `선물 완료` : `거래 성사`, 'success');
    haptic('success');
    setTradeTargetIdx(null);
  };
  
  const executeTradeBetween = ({ fromId, toId, give, want }) => {
    setState(s => {
      const players = s.players.map(p => ({ ...p, hand: [...p.hand], fields: p.fields.map(f => ({ ...f })), coins: [...p.coins] }));
      const from = players.find(p => p.id === fromId);
      const to = players.find(p => p.id === toId);
      let flipped = [...s.flippedCards];
      
      // Extract given cards from source
      const givenCards = [];
      for (const g of give) {
        if (g.source === 'flipped') {
          const idx = flipped.findIndex(c => c.id === g.id);
          if (idx >= 0) givenCards.push(flipped.splice(idx, 1)[0]);
        } else {
          const idx = from.hand.findIndex(c => c.id === g.id);
          if (idx >= 0) givenCards.push(from.hand.splice(idx, 1)[0]);
        }
      }
      
      // Extract wanted cards from target
      const wantedCards = [];
      for (const w of want) {
        const idx = to.hand.findIndex(c => c.id === w.id);
        if (idx >= 0) wantedCards.push(to.hand.splice(idx, 1)[0]);
      }
      
      // Given cards are stored pending-plant for the receiver (to plant immediately)
      // Wanted cards come to fromId pending-plant
      // Per Bohnanza rules: all cards received via trade must be planted immediately
      const receivedTrades = { ...s.receivedTrades };
      receivedTrades[toId] = [...(receivedTrades[toId] || []), ...givenCards];
      receivedTrades[fromId] = [...(receivedTrades[fromId] || []), ...wantedCards];
      
      return { ...s, players, flippedCards: flipped, receivedTrades };
    });
  };
  
  // Plant received-trade cards for CPU and human. CPU auto, human prompts per card.
  // For simplicity, auto-plant all pending trades and flipped-remaining for both players at end of trade phase.
  
  const endTradePhase = () => {
    setState(s => ({ ...s, phase: 'plantFaceUp' }));
  };
  
  // ============ Phase: PlantFaceUp ============
  // Plant all remaining flipped + all receivedTrades. Player can choose fields.
  // For human: show a prompt step-by-step.
  // For CPU turns (non-human current): auto-plant everything.
  
  const [planting, setPlanting] = useState(null); // { card, owner }
  
  useEffect(() => {
    if (state.phase !== 'plantFaceUp') return;
    let cancelled = false;
    
    const PLANT_DELAY = 1100; // slow enough to read "X is planting Y → field N"
    
    const announceAndPlant = ({ actorId, card, fromSource, computeTargetIdx, applyState, isHumanForced }) => {
      // Pre-compute target idx against CURRENT state so the banner tells truth
      const actor = state.players.find(p => p.id === actorId);
      const { idx: previewIdx } = findBestFieldForCard(actor, card.type);
      setActiveAction({
        kind: 'plant',
        actorId,
        actorName: actor.name,
        actorColor: actor.color,
        actorAvatar: actor.avatar,
        bean: card.type,
        fromSource, // 'trade' | 'market' | 'hand'
        destFieldIdx: previewIdx,
      });
      const t = setTimeout(() => {
        if (cancelled) return;
        let landedIdx = previewIdx;
        setState(s => {
          const result = applyState(s);
          if (result && result.landedIdx !== undefined) landedIdx = result.landedIdx;
          return result?.next || s;
        });
        flashField(actorId, landedIdx);
        setActiveAction(null);
        haptic('light');
      }, PLANT_DELAY);
      return () => { cancelled = true; clearTimeout(t); setActiveAction(null); };
    };
    
    const playerWithPending = state.players.find(p => (state.receivedTrades[p.id] || []).length > 0);
    if (playerWithPending) {
      const card = state.receivedTrades[playerWithPending.id][0];
      if (playerWithPending.isHuman) {
        const { forcedHarvest } = findBestFieldForCard(playerWithPending, card.type);
        if (!forcedHarvest) {
          return announceAndPlant({
            actorId: playerWithPending.id,
            card,
            fromSource: 'trade',
            applyState: (s) => {
              if (s.phase !== 'plantFaceUp') return { next: s };
              const pending = s.receivedTrades[playerWithPending.id] || [];
              if (pending[0]?.id !== card.id) return { next: s };
              const p = s.players.find(pp => pp.id === playerWithPending.id);
              const { idx } = findBestFieldForCard(p, card.type);
              const { players, discard } = plantCard(s.players, playerWithPending.id, idx, card, s.discard);
              const rt = { ...s.receivedTrades };
              rt[playerWithPending.id] = rt[playerWithPending.id].slice(1);
              if (rt[playerWithPending.id].length === 0) delete rt[playerWithPending.id];
              return { next: { ...s, players, discard, receivedTrades: rt }, landedIdx: idx };
            },
          });
        } else {
          setHarvestPrompt({
            card,
            label: '받은 카드를 심을 밭 선택',
            onChoose: (fieldIdx) => {
              setState(s => {
                const pending = s.receivedTrades[playerWithPending.id] || [];
                if (pending[0]?.id !== card.id) return s;
                const { players, discard } = plantCard(s.players, playerWithPending.id, fieldIdx, card, s.discard);
                const rt = { ...s.receivedTrades };
                rt[playerWithPending.id] = rt[playerWithPending.id].slice(1);
                if (rt[playerWithPending.id].length === 0) delete rt[playerWithPending.id];
                return { ...s, players, discard, receivedTrades: rt };
              });
              flashField(playerWithPending.id, fieldIdx);
              setHarvestPrompt(null);
              haptic('medium');
            },
          });
          return () => { cancelled = true; };
        }
      } else {
        return announceAndPlant({
          actorId: playerWithPending.id,
          card,
          fromSource: 'trade',
          applyState: (s) => {
            if (s.phase !== 'plantFaceUp') return { next: s };
            const pending = s.receivedTrades[playerWithPending.id] || [];
            if (pending[0]?.id !== card.id) return { next: s };
            const p = s.players.find(pp => pp.id === playerWithPending.id);
            const { idx } = findBestFieldForCard(p, card.type);
            const { players, discard } = plantCard(s.players, playerWithPending.id, idx, card, s.discard);
            const rt = { ...s.receivedTrades };
            rt[playerWithPending.id] = rt[playerWithPending.id].slice(1);
            if (rt[playerWithPending.id].length === 0) delete rt[playerWithPending.id];
            return { next: { ...s, players, discard, receivedTrades: rt }, landedIdx: idx };
          },
        });
      }
    }
    
    if (state.flippedCards.length > 0) {
      const card = state.flippedCards[0];
      const cp = state.players[state.currentPlayerIdx];
      if (cp.isHuman) {
        const { forcedHarvest } = findBestFieldForCard(cp, card.type);
        if (!forcedHarvest) {
          return announceAndPlant({
            actorId: cp.id,
            card,
            fromSource: 'market',
            applyState: (s) => {
              if (s.phase !== 'plantFaceUp') return { next: s };
              if (s.flippedCards[0]?.id !== card.id) return { next: s };
              const p = s.players[s.currentPlayerIdx];
              const { idx } = findBestFieldForCard(p, card.type);
              const { players, discard } = plantCard(s.players, p.id, idx, card, s.discard);
              return { next: { ...s, players, discard, flippedCards: s.flippedCards.slice(1) }, landedIdx: idx };
            },
          });
        } else {
          setHarvestPrompt({
            card,
            label: '시장 카드를 심을 밭 선택 (강제 수확)',
            onChoose: (fieldIdx) => {
              setState(s => {
                if (s.flippedCards[0]?.id !== card.id) return s;
                const { players, discard } = plantCard(s.players, cp.id, fieldIdx, card, s.discard);
                return { ...s, players, discard, flippedCards: s.flippedCards.slice(1) };
              });
              flashField(cp.id, fieldIdx);
              setHarvestPrompt(null);
              haptic('medium');
            },
          });
          return () => { cancelled = true; };
        }
      } else {
        return announceAndPlant({
          actorId: cp.id,
          card,
          fromSource: 'market',
          applyState: (s) => {
            if (s.phase !== 'plantFaceUp') return { next: s };
            if (s.flippedCards[0]?.id !== card.id) return { next: s };
            const p = s.players[s.currentPlayerIdx];
            const { idx } = findBestFieldForCard(p, card.type);
            const { players, discard } = plantCard(s.players, p.id, idx, card, s.discard);
            return { next: { ...s, players, discard, flippedCards: s.flippedCards.slice(1) }, landedIdx: idx };
          },
        });
      }
    }
    
    // Nothing left to plant -> draw phase
    setState(s => s.phase === 'plantFaceUp' ? ({ ...s, phase: 'draw' }) : s);
    return () => { cancelled = true; };
  }, [state.phase, state.receivedTrades, state.flippedCards, state.players, state.currentPlayerIdx]);
  
  // ============ Phase: Draw ============
  useEffect(() => {
    if (state.phase !== 'draw') return;
    const t = setTimeout(() => {
      setState(s => {
        const { drawn, deck, discard, reshuffles, gameOver } = drawCards(s, DRAW_PER_TURN);
        const cp = s.players[s.currentPlayerIdx];
        const newPlayers = s.players.map(p => p.id === cp.id ? { ...p, hand: [...p.hand, ...drawn] } : p);
        if (gameOver) {
          return { ...s, players: newPlayers, deck, discard, reshuffles, gameOver: true, phase: 'ended' };
        }
        // Advance turn
        const nextIdx = (s.currentPlayerIdx + 1) % s.players.length;
        return {
          ...s,
          players: newPlayers,
          deck, discard, reshuffles, gameOver,
          currentPlayerIdx: nextIdx,
          phase: 'plant1',
          logs: [...s.logs.slice(-20), { id: Date.now(), text: `${s.players[nextIdx].name}의 차례.`, type: 'info' }],
        };
      });
    }, 600);
    return () => clearTimeout(t);
  }, [state.phase]);
  
  // ============ CPU Turn Automation ============
  const cpuActingRef = useRef(false);
  useEffect(() => {
    if (isHumanTurn) return;
    if (state.gameOver) return;
    if (cpuActingRef.current) return;
    
    const phase = state.phase;
    const cp = state.players[state.currentPlayerIdx];
    
    if (phase === 'plant1') {
      cpuActingRef.current = true;
      setTimeout(() => {
        const { plantFirst } = cpuDecidePlantFromHand(cp, cp.difficulty);
        if (!plantFirst || cp.hand.length === 0) {
          setState(s => ({ ...s, phase: 'reveal' }));
          cpuActingRef.current = false;
          return;
        }
        const card = cp.hand[0];
        // Check voluntary harvest first (hard/normal AI)
        const harvestIdx = cpuConsiderVoluntaryHarvest(cp, cp.difficulty);
        if (harvestIdx !== null && Math.random() < 0.3) {
          setState(s => {
            const { players, discard, coinsGained } = harvestField(s.players, cp.id, harvestIdx, s.discard);
            const cn = players.find(p => p.id === cp.id).name;
            return { ...s, players, discard, logs: [...s.logs.slice(-20), { id: Date.now(), text: `${cn}이(가) 밭을 수확 (+${coinsGained}금화).`, type: 'harvest' }] };
          });
        }
        
        // Pre-compute dest field idx for banner (based on current state before planting)
        const { idx: previewFi } = findBestFieldForCard(cp, card.type);
        setActiveAction({
          kind: 'plant',
          actorId: cp.id,
          actorName: cp.name,
          actorColor: cp.color,
          actorAvatar: cp.avatar,
          bean: card.type,
          fromSource: 'hand',
          destFieldIdx: previewFi,
        });
        
        setTimeout(() => {
          let landedIdx = previewFi;
          setState(s => {
            const p = s.players.find(x => x.id === cp.id);
            const { idx: fi } = findBestFieldForCard(p, card.type);
            landedIdx = fi;
            const { players, discard } = plantCard(s.players, cp.id, fi, card, s.discard);
            const newPlayers = players.map(p => p.id === cp.id ? { ...p, hand: p.hand.slice(1) } : p);
            return { ...s, players: newPlayers, discard, phase: 'plant2', logs: [...s.logs.slice(-20), { id: Date.now(), text: `${cp.name}이(가) ${BEAN_TYPES[card.type].ko}을(를) 심었습니다.`, type: 'plant' }] };
          });
          flashField(cp.id, landedIdx);
          setActiveAction(null);
          cpuActingRef.current = false;
        }, 1000);
      }, 500);
    } else if (phase === 'plant2') {
      cpuActingRef.current = true;
      setTimeout(() => {
        const { plantSecond } = cpuDecidePlantFromHand(cp, cp.difficulty);
        if (!plantSecond || cp.hand.length === 0) {
          setState(s => ({ ...s, phase: 'reveal' }));
          cpuActingRef.current = false;
          return;
        }
        const card = cp.hand[0];
        if (!card) {
          setState(s => ({ ...s, phase: 'reveal' }));
          cpuActingRef.current = false;
          return;
        }
        const { idx: previewFi } = findBestFieldForCard(cp, card.type);
        setActiveAction({
          kind: 'plant',
          actorId: cp.id,
          actorName: cp.name,
          actorColor: cp.color,
          actorAvatar: cp.avatar,
          bean: card.type,
          fromSource: 'hand',
          destFieldIdx: previewFi,
        });
        setTimeout(() => {
          let landedIdx = previewFi;
          setState(s => {
            const p = s.players.find(x => x.id === cp.id);
            const handCard = p.hand[0];
            if (!handCard) return { ...s, phase: 'reveal' };
            const { idx: fi } = findBestFieldForCard(p, handCard.type);
            landedIdx = fi;
            const { players, discard } = plantCard(s.players, cp.id, fi, handCard, s.discard);
            const newPlayers = players.map(pp => pp.id === cp.id ? { ...pp, hand: pp.hand.slice(1) } : pp);
            return { ...s, players: newPlayers, discard, phase: 'reveal', logs: [...s.logs.slice(-20), { id: Date.now(), text: `${cp.name}이(가) ${BEAN_TYPES[handCard.type].ko}도 심었습니다.`, type: 'plant' }] };
          });
          flashField(cp.id, landedIdx);
          setActiveAction(null);
          cpuActingRef.current = false;
        }, 1000);
      }, 500);
    } else if (phase === 'trade') {
      cpuActingRef.current = true;
      setTimeout(() => {
        const others = state.players.filter(p => p.id !== cp.id);
        const proposals = cpuProposeTrade(cp, state.flippedCards, others, cp.difficulty);
        
        if (proposals.length === 0) {
          setState(s => ({ ...s, phase: 'plantFaceUp' }));
          cpuActingRef.current = false;
          return;
        }
        
        const prop = proposals[0];
        const target = state.players.find(p => p.id === prop.target);
        
        if (target.isHuman) {
          setIncomingTrade({
            from: cp,
            give: prop.give,
            want: prop.want,
            isGift: prop.isGift,
          });
          return;
        }
        
        // CPU-to-CPU
        const giveTypes = prop.give.map(g => {
          if (g.source === 'flipped') return state.flippedCards.find(c => c.id === g.id).type;
          return cp.hand.find(c => c.id === g.id).type;
        });
        const wantTypes = prop.want.map(w => target.hand.find(c => c.id === w.id).type);
        const accepts = cpuEvaluateTrade(target, wantTypes, giveTypes, target.difficulty);
        const willExecute = accepts;
        
        // STEP 1: Show proposal banner (1400ms)
        setActiveAction({
          kind: 'trade',
          phase: 'proposing',
          fromActor: { id: cp.id, name: cp.name, color: cp.color, avatar: cp.avatar },
          toActor: { id: target.id, name: target.name, color: target.color, avatar: target.avatar },
          giveTypes,
          wantTypes,
          isGift: prop.isGift,
        });
        
        setTimeout(() => {
          // STEP 2: Show outcome banner (900ms)
          setActiveAction({
            kind: 'trade',
            phase: willExecute ? 'accepted' : 'declined',
            fromActor: { id: cp.id, name: cp.name, color: cp.color, avatar: cp.avatar },
            toActor: { id: target.id, name: target.name, color: target.color, avatar: target.avatar },
            giveTypes,
            wantTypes,
            isGift: prop.isGift,
          });
          
          if (willExecute) {
            executeTradeBetween({ fromId: cp.id, toId: target.id, give: prop.give, want: prop.want });
            addLog(`${cp.name} → ${target.name} 거래 성사`, 'success');
          } else {
            addLog(`${target.name}이(가) ${cp.name}의 거래를 거절`, 'error');
          }
          
          setTimeout(() => {
            setActiveAction(null);
            setState(s => ({ ...s, phase: 'plantFaceUp' }));
            cpuActingRef.current = false;
          }, 900);
        }, 1400);
      }, 900);
    }
  }, [state.phase, state.currentPlayerIdx, isHumanTurn, state.gameOver]);
  
  // Handle incoming CPU trade (proposed to human)
  const handleAcceptIncoming = () => {
    if (!incomingTrade) return;
    const { from, give, want } = incomingTrade;
    executeTradeBetween({ fromId: from.id, toId: 0, give, want });
    addLog(`${from.name}의 거래 수락`, 'success');
    showToast('거래 수락', 'success');
    haptic('success');
    setIncomingTrade(null);
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'plantFaceUp' }));
      cpuActingRef.current = false;
    }, 300);
  };
  const handleDeclineIncoming = () => {
    addLog(`${incomingTrade.from.name}의 거래 거절`, 'error');
    showToast('거래 거절', 'error');
    haptic('light');
    setIncomingTrade(null);
    setTimeout(() => {
      setState(s => ({ ...s, phase: 'plantFaceUp' }));
      cpuActingRef.current = false;
    }, 300);
  };
  
  // Manual harvest from field click (human)
  const handleHarvestClick = (fieldIdx) => {
    if (!isHumanTurn) return;
    if (!canHarvestField(humanPlayer.fields, fieldIdx, false)) {
      showToast('이 밭은 수확할 수 없습니다 (1장 필드 + 다른 밭이 큼)', 'error');
      haptic('error');
      return;
    }
    setState(s => {
      const { players, discard, coinsGained } = harvestField(s.players, 0, fieldIdx, s.discard);
      return { ...s, players, discard, logs: [...s.logs.slice(-20), { id: Date.now(), text: `${BEAN_TYPES[humanPlayer.fields[fieldIdx].type].ko} 수확 (+${coinsGained}금화)`, type: 'harvest' }] };
    });
    showToast(`+${coinsForField(humanPlayer.fields[fieldIdx].type, humanPlayer.fields[fieldIdx].count)} 금화`, 'success');
    haptic('success');
  };
  
  const targetPlayerForTrade = tradeTargetIdx !== null ? state.players[tradeTargetIdx] : null;
  
  // Phase label
  const phaseLabel = {
    plant1: '1차 심기 (필수: 맨앞)',
    plant2: '2차 심기 (선택)',
    reveal: '시장 카드 공개 중...',
    trade: '거래 단계',
    plantFaceUp: '거래된 카드 심기',
    draw: '카드 뽑기',
    ended: '게임 종료',
  }[state.phase] || state.phase;
  
  // ============ GAME OVER ============
  if (state.phase === 'ended' || state.gameOver) {
    // Force-harvest everyone's fields
    const finalPlayers = state.players.map(p => {
      let coins = [...p.coins];
      p.fields.forEach(f => {
        if (f.count > 0) {
          const c = coinsForField(f.type, f.count);
          for (let i = 0; i < c; i++) coins.push({ id: Math.random(), type: f.type });
        }
      });
      return { ...p, finalCoins: coins.length };
    });
    const sorted = [...finalPlayers].sort((a, b) => b.finalCoins - a.finalCoins);
    const winner = sorted[0];
    
    return (
      <div className="min-h-screen paper-texture p-4" style={{ background: '#f5efe0' }}>
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-6 pop-in">
            <Trophy size={56} className="mx-auto mb-2 text-amber-600"/>
            <h2 className="font-display font-bold text-4xl mb-1" style={{ color: '#3a2e1e' }}>게임 종료!</h2>
            <p className="font-body text-stone-600">
              <span className="font-bold" style={{ color: winner.color }}>{winner.name}</span> 승리!
            </p>
          </div>
          
          <div className="bg-[#faf4e6] rounded-2xl p-4 card-shadow-lg mb-4">
            {sorted.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-3 border-b border-stone-200 last:border-0 slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="font-display font-bold text-2xl w-8 text-center" style={{ color: i === 0 ? '#d4a04a' : '#78716c' }}>
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white" style={{ background: p.color }}>
                  {p.avatar}
                </div>
                <div className="flex-1 font-body font-semibold" style={{ color: '#3a2e1e' }}>
                  {p.name}
                  {p.isHuman && <span className="ml-1 text-xs font-normal text-stone-500">(나)</span>}
                </div>
                <CoinStack count={p.finalCoins} size="md"/>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-stone-200 font-body font-semibold text-stone-700 btn-tactile"
            >
              처음으로
            </button>
            <button
              onClick={() => {
                haptic('success');
                setState(makeInitialState(config));
              }}
              className="flex-1 py-3 rounded-xl bg-amber-700 text-amber-50 font-body font-semibold btn-tactile"
            >
              <RotateCcw size={16} className="inline mr-1"/> 다시 하기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Phase-specific instruction for the banner
  const phaseInstruction = (() => {
    if (state.phase === 'plant1') return isHumanTurn ? '맨 앞 카드를 탭하여 심으세요' : `${currentPlayer.name}이(가) 심는 중…`;
    if (state.phase === 'plant2') return isHumanTurn ? '한 장 더 심기 (선택) 또는 건너뛰기' : `${currentPlayer.name}의 2차 심기…`;
    if (state.phase === 'reveal') return '시장 카드 공개 중…';
    if (state.phase === 'trade') return isHumanTurn ? '상대 농부를 탭하여 거래 제안' : `${currentPlayer.name}이(가) 거래 중…`;
    if (state.phase === 'plantFaceUp') return '받은 카드를 밭에 심는 중…';
    if (state.phase === 'draw') return '카드를 뽑는 중…';
    return phaseLabel;
  })();
  
  const logIcon = (type) => {
    const m = {
      success: { c: 'bg-emerald-500', el: '✓' },
      error: { c: 'bg-rose-500', el: '×' },
      harvest: { c: 'bg-amber-500', el: '◈' },
      plant: { c: 'bg-green-600', el: '▲' },
      reveal: { c: 'bg-blue-500', el: '◉' },
      info: { c: 'bg-stone-400', el: '•' },
    }[type] || { c: 'bg-stone-400', el: '•' };
    return (
      <span className={`inline-flex items-center justify-center flex-shrink-0 w-4 h-4 rounded-full text-[9px] font-bold text-white ${m.c}`}>
        {m.el}
      </span>
    );
  };
  
  return (
    <div className="min-h-screen paper-texture" style={{ background: '#f5efe0' }}>
      <GlobalStyle/>
      
      {/* Slim top bar */}
      <header className="sticky top-0 z-30 bg-[#f5efe0]/95 backdrop-blur-sm border-b border-stone-300">
        <div className="max-w-lg mx-auto px-3 py-2 flex items-center justify-between gap-2">
          <button onClick={onExit} className="p-1.5 rounded-full hover:bg-stone-200 btn-tactile">
            <X size={16}/>
          </button>
          <div className="flex items-center gap-3 text-xs font-body">
            <div className="flex items-center gap-1" title="덱 잔여">
              <Layers size={13} className="text-stone-600"/>
              <span className="font-mono font-semibold">{state.deck.length}</span>
            </div>
            <div className="flex items-center gap-1" title="재셔플">
              <Shuffle size={13} className="text-stone-600"/>
              <span className="font-mono font-semibold">{state.reshuffles}/{MAX_DECK_RESHUFFLES}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { setShowBoardOverview(true); haptic('light'); }} className="px-2 py-1 rounded-full hover:bg-stone-200 btn-tactile text-stone-700 text-xs font-body font-semibold flex items-center gap-1">
              <Users size={12}/> 전체
            </button>
            <button onClick={() => setShowRulebook(true)} className="px-2 py-1 rounded-full hover:bg-stone-200 btn-tactile text-stone-700 text-xs font-body font-semibold">
              규칙
            </button>
          </div>
        </div>
      </header>
      
      {/* TURN BANNER + ACTIVITY (prominent, sticky below header) */}
      <div className="sticky top-[42px] z-20 bg-[#f5efe0]/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
        <div className="max-w-lg mx-auto px-3 py-2.5 space-y-2">
          {/* Big turn card */}
          <div 
            className="relative rounded-xl p-3 flex items-center gap-3 overflow-hidden"
            style={{ 
              background: isHumanTurn 
                ? `linear-gradient(135deg, ${humanPlayer.color}12, #faf4e6)` 
                : `linear-gradient(135deg, ${currentPlayer.color}18, #faf4e6)`,
              boxShadow: `0 0 0 2px ${currentPlayer.color}55, 0 4px 12px rgba(72,50,30,0.1)`
            }}
          >
            {/* subtle side band */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: currentPlayer.color }}/>
            
            <div className="relative flex-shrink-0 ml-1">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white text-lg breathe card-shadow"
                style={{ background: currentPlayer.color }}
              >
                {currentPlayer.avatar}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <div className="font-display font-bold text-xl leading-none" style={{ color: '#3a2e1e' }}>
                  {isHumanTurn ? '내 차례' : `${currentPlayer.name}의 차례`}
                </div>
                <div className="text-[10px] font-body uppercase tracking-wider text-stone-500">
                  {phaseLabel}
                </div>
              </div>
              <div className="text-xs font-body text-stone-700 mt-1 leading-tight">
                {phaseInstruction}
              </div>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <div className="text-[9px] font-body uppercase tracking-wider text-stone-500">금화</div>
              <CoinStack count={currentPlayer.coins.length} size="sm"/>
            </div>
          </div>
          
          {/* Recent activity - last 2 items, newest on top */}
          {state.logs.length > 0 && (
            <div className="flex flex-col gap-1">
              {state.logs.slice(-2).reverse().map((l, i) => (
                <div 
                  key={l.id} 
                  className={`text-xs font-body leading-tight flex items-center gap-2 slide-in ${i === 0 ? 'text-stone-800 font-medium' : 'text-stone-500'}`}
                  style={{ opacity: i === 0 ? 1 : 0.7 }}
                >
                  {logIcon(l.type)}
                  <span className="truncate flex-1">{l.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* ACTION BANNER — shows which card is moving where during auto-resolution */}
      {activeAction && activeAction.kind === 'plant' && (
        <div className="fixed top-[150px] left-1/2 -translate-x-1/2 z-40 pointer-events-none pop-in">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl card-shadow-lg border-2 border-amber-500 px-3 py-2 flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: activeAction.actorColor }}>
                {activeAction.actorAvatar}
              </div>
              <div className="text-[9px] font-body font-semibold mt-0.5" style={{ color: '#3a2e1e' }}>{activeAction.actorName}</div>
            </div>
            <ArrowRight size={14} className="text-amber-700"/>
            <div className="card-drop">
              <BeanCard type={activeAction.bean} size="sm"/>
            </div>
            <ArrowRight size={14} className="text-amber-700"/>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg border-2 border-amber-600 bg-amber-50 flex items-center justify-center">
                <Sprout size={16} className="text-amber-700"/>
              </div>
              <div className="text-[9px] font-body font-semibold mt-0.5 text-amber-800">밭 {activeAction.destFieldIdx + 1}</div>
            </div>
          </div>
          <div className="text-center text-[10px] font-body text-stone-700 font-semibold mt-1 bg-white/80 rounded-full px-2 py-0.5 inline-block relative left-1/2 -translate-x-1/2">
            {activeAction.fromSource === 'trade' ? '거래받은 카드 심는 중…' 
             : activeAction.fromSource === 'market' ? '시장 카드 심는 중…' 
             : '심는 중…'}
          </div>
        </div>
      )}
      
      {activeAction && activeAction.kind === 'trade' && (
        <div className="fixed top-[140px] left-1/2 -translate-x-1/2 z-40 pointer-events-none pop-in w-[90%] max-w-sm">
          <div className={`bg-white/95 backdrop-blur-sm rounded-2xl card-shadow-lg border-2 px-3 py-2.5 ${
            activeAction.phase === 'accepted' ? 'border-emerald-500' :
            activeAction.phase === 'declined' ? 'border-rose-500' :
            'border-amber-500'
          }`}>
            {/* Row with two avatars */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: activeAction.fromActor.color }}>
                  {activeAction.fromActor.avatar}
                </div>
                <div className="text-[9px] font-body font-semibold mt-0.5" style={{ color: '#3a2e1e' }}>{activeAction.fromActor.name}</div>
              </div>
              
              {/* Card exchange middle */}
              <div className="flex-1 flex flex-col items-center gap-0.5">
                {/* Give cards row: from → to */}
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {activeAction.giveTypes.slice(0, 3).map((t, i) => <BeanCard key={`g${i}`} type={t} size="xs"/>)}
                    {activeAction.giveTypes.length > 3 && <span className="text-[9px] font-mono self-center">+{activeAction.giveTypes.length - 3}</span>}
                  </div>
                  <ArrowRight size={12} className="text-amber-700 flex-shrink-0"/>
                </div>
                {/* Want cards row: from ← to (only if not gift) */}
                {activeAction.wantTypes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <ArrowRight size={12} className="text-amber-700 flex-shrink-0 rotate-180"/>
                    <div className="flex gap-0.5">
                      {activeAction.wantTypes.slice(0, 3).map((t, i) => <BeanCard key={`w${i}`} type={t} size="xs"/>)}
                      {activeAction.wantTypes.length > 3 && <span className="text-[9px] font-mono self-center">+{activeAction.wantTypes.length - 3}</span>}
                    </div>
                  </div>
                )}
                {activeAction.isGift && (
                  <div className="flex items-center gap-1 text-[9px] font-body text-amber-800">
                    <Gift size={10}/> 선물
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: activeAction.toActor.color }}>
                  {activeAction.toActor.avatar}
                </div>
                <div className="text-[9px] font-body font-semibold mt-0.5" style={{ color: '#3a2e1e' }}>{activeAction.toActor.name}</div>
              </div>
            </div>
          </div>
          <div className={`text-center text-[10px] font-body font-bold mt-1 rounded-full px-2 py-0.5 inline-block relative left-1/2 -translate-x-1/2 ${
            activeAction.phase === 'accepted' ? 'bg-emerald-600 text-white' :
            activeAction.phase === 'declined' ? 'bg-rose-600 text-white' :
            'bg-white/90 text-stone-700'
          }`}>
            {activeAction.phase === 'proposing' && `${activeAction.fromActor.name} → ${activeAction.toActor.name} 거래 제안 중…`}
            {activeAction.phase === 'accepted' && '✓ 거래 성사!'}
            {activeAction.phase === 'declined' && '✕ 거래 거절'}
          </div>
        </div>
      )}
      
      <div className="max-w-lg mx-auto p-3 space-y-3">
        {/* Opponents */}
        <section>
          <div className="text-[10px] font-body text-stone-500 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
            <span>상대 농부</span>
            {isHumanTurn && state.phase === 'trade' && (
              <span className="text-amber-700 font-semibold normal-case tracking-normal">👇 탭해서 거래 제안</span>
            )}
          </div>
          <div className="space-y-2">
            {state.players.filter(p => !p.isHuman).map(p => (
              <OpponentPanel
                key={p.id}
                player={p}
                isCurrentTurn={state.currentPlayerIdx === state.players.indexOf(p)}
                highlighted={tradeTargetIdx === state.players.indexOf(p)}
                onClick={isHumanTurn && state.phase === 'trade' ? () => handleOpenTrade(state.players.indexOf(p)) : undefined}
                onTradeOffer={isHumanTurn && state.phase === 'trade'}
              />
            ))}
          </div>
        </section>
        
        {/* Market (flipped cards) */}
        {state.flippedCards.length > 0 && (
          <section className="bg-[#faf4e6] rounded-2xl p-3 card-shadow pop-in">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-body font-semibold text-amber-900">
                <Shuffle size={12} className="inline mr-1"/> 시장 카드
              </div>
              <div className="text-[10px] font-body text-stone-500">
                {state.phase === 'trade' ? '거래 가능' : '심어야 함'}
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              {state.flippedCards.map((c, i) => (
                <div key={c.id} className="deal-in" style={{ animationDelay: `${i * 120}ms` }}>
                  <BeanCard type={c.type} size="md"/>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Current player (me) */}
        <section className="bg-[#faf4e6] rounded-2xl p-3 card-shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: humanPlayer.color }}>
                {humanPlayer.avatar}
              </div>
              <div>
                <div className="font-body font-semibold text-sm" style={{ color: '#3a2e1e' }}>{humanPlayer.name}</div>
                <div className="text-[10px] font-body text-stone-500">
                  {isHumanTurn ? <span className="text-amber-700 font-semibold">내 차례 · {phaseLabel}</span> : '상대 차례 대기'}
                </div>
              </div>
            </div>
            <CoinStack count={humanPlayer.coins.length} size="md"/>
          </div>
          
          {/* Fields */}
          <div className={`grid gap-2 mb-3 ${humanPlayer.fields.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {humanPlayer.fields.map((f, i) => (
              <Field
                key={i}
                field={f}
                onClick={isHumanTurn && (state.phase === 'plant1' || state.phase === 'plant2' || state.phase === 'trade') ? () => handleHarvestClick(i) : undefined}
                showHarvestButton={isHumanTurn && f.count > 0}
                canHarvest={canHarvestField(humanPlayer.fields, i, false)}
                onHarvest={() => handleHarvestClick(i)}
                justPlanted={recentPlanted?.playerId === 0 && recentPlanted?.fieldIdx === i}
              />
            ))}
          </div>
          
          {/* Hand */}
          <div className="bg-stone-100 rounded-xl p-2">
            <div className="text-[10px] font-body text-stone-600 mb-1 px-1 flex items-center justify-between">
              <span>내 손패 <span className="text-stone-400 text-[9px]">(순서 고정)</span></span>
              <span className="font-mono">{humanPlayer.hand.length}장</span>
            </div>
            <Hand
              cards={humanPlayer.hand}
              onPlant={handlePlantFromHand}
              plantableIndices={isHumanTurn && (state.phase === 'plant1' || state.phase === 'plant2') ? [0] : []}
              phase={state.phase}
              size="md"
            />
          </div>
          
          {/* Action bar */}
          {isHumanTurn && (
            <div className="mt-3 flex gap-2">
              {state.phase === 'plant2' && (
                <button
                  onClick={handleSkipSecondPlant}
                  className="flex-1 py-2.5 rounded-xl bg-stone-200 font-body font-semibold text-stone-700 text-sm btn-tactile"
                >
                  2차 심기 건너뛰기
                </button>
              )}
              {state.phase === 'trade' && (
                <button
                  onClick={endTradePhase}
                  className="flex-1 py-2.5 rounded-xl bg-amber-700 text-amber-50 font-body font-semibold text-sm btn-tactile"
                >
                  거래 종료 · 카드 심기
                </button>
              )}
              {state.phase === 'plant1' && (
                <div className="flex-1 py-2.5 text-center text-sm font-body text-stone-600 bg-amber-100 rounded-xl">
                  맨 앞 카드를 탭하여 심으세요
                </div>
              )}
            </div>
          )}
        </section>
      </div>
      
      {/* Trade modal */}
      <TradeModal
        open={tradeTargetIdx !== null}
        onClose={() => setTradeTargetIdx(null)}
        currentPlayer={humanPlayer}
        targetPlayer={targetPlayerForTrade}
        flippedCards={state.flippedCards}
        onExecute={handleExecuteTrade}
      />
      
      {/* Incoming trade (CPU proposes to human) */}
      {incomingTrade && (() => {
        const senderLive = state.players.find(p => p.id === incomingTrade.from.id);
        return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/70 backdrop-blur-sm">
          <div className="bg-[#faf4e6] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl card-shadow-lg pop-in overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="px-4 pt-3 pb-2 text-center flex-shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-body font-bold uppercase tracking-wider">
                <Gift size={11}/> 거래 제안 도착
              </div>
            </div>
            
            <div className="px-4 pb-3 space-y-3 overflow-y-auto">
              {/* Card exchange visualization */}
              <div className="bg-white/60 rounded-xl p-3 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-sm card-shadow" style={{ background: incomingTrade.from.color }}>
                      {incomingTrade.from.avatar}
                    </div>
                    <div className="text-[9px] font-body text-stone-600 mt-0.5 font-semibold">{incomingTrade.from.name}</div>
                  </div>
                  <ArrowRight size={18} className="text-amber-700 flex-shrink-0"/>
                  <div className="flex-1 flex items-center gap-1 flex-wrap min-h-[54px]">
                    {incomingTrade.give.map((g, i) => {
                      const card = g.source === 'flipped' 
                        ? state.flippedCards.find(c => c.id === g.id)
                        : senderLive?.hand.find(c => c.id === g.id) || incomingTrade.from.hand.find(c => c.id === g.id);
                      return card ? <BeanCard key={i} type={card.type} size="xs"/> : null;
                    })}
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-sm card-shadow" style={{ background: humanPlayer.color }}>
                      {humanPlayer.avatar}
                    </div>
                    <div className="text-[9px] font-body text-stone-600 mt-0.5 font-semibold">나</div>
                  </div>
                </div>
                
                <div className="h-px bg-stone-200 my-2"/>
                
                {incomingTrade.want.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-10 flex-shrink-0"/>
                    <ArrowRight size={18} className="text-amber-700 rotate-180 flex-shrink-0"/>
                    <div className="flex-1 flex items-center gap-1 flex-wrap min-h-[54px]">
                      {incomingTrade.want.map((w, i) => {
                        const card = humanPlayer.hand.find(c => c.id === w.id);
                        return card ? <BeanCard key={i} type={card.type} size="xs"/> : null;
                      })}
                    </div>
                    <div className="w-10 flex-shrink-0"/>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-body text-amber-900 bg-amber-100 rounded-lg py-1.5 px-2">
                    <Gift size={12}/> 선물입니다 · 대가 없음
                  </div>
                )}
              </div>
              
              {/* Context: both players' fields */}
              <div className="space-y-2 bg-stone-50 rounded-xl p-2 border border-stone-200">
                <div className="text-[9px] font-body text-stone-500 uppercase tracking-wider text-center">
                  💡 판단에 도움이 되는 정보
                </div>
                <MiniFieldRow player={senderLive || incomingTrade.from} label={`${incomingTrade.from.name}의 밭`}/>
                <MiniFieldRow player={humanPlayer} label="내 밭"/>
              </div>
              
              {/* Collapsible hands */}
              <div className="space-y-1.5">
                <CollapsibleHand player={humanPlayer} label="내 손패" defaultOpen={false}/>
                <CollapsibleHand player={senderLive || incomingTrade.from} label={`${incomingTrade.from.name}의 손패`} defaultOpen={false}/>
              </div>
              
              <div className="text-center text-[11px] font-body text-stone-600">
                {incomingTrade.want.length === 0 
                  ? `${incomingTrade.from.name}이(가) 무료로 카드를 주고 싶어합니다`
                  : `${incomingTrade.give.length}장을 주고 ${incomingTrade.want.length}장을 받고 싶어합니다`
                }
              </div>
            </div>
            
            <div className="border-t border-stone-300 p-3 flex gap-2 bg-[#f5efe0] flex-shrink-0">
              <button onClick={handleDeclineIncoming} className="flex-1 py-3 rounded-xl bg-stone-200 font-body font-semibold text-stone-700 btn-tactile">
                거절
              </button>
              <button onClick={handleAcceptIncoming} className="flex-[2] py-3 rounded-xl bg-amber-700 text-amber-50 font-body font-bold btn-tactile flex items-center justify-center gap-1 card-shadow">
                <Check size={16}/> 수락
              </button>
            </div>
          </div>
        </div>
        );
      })()}
      
      {/* Harvest prompt (choose field) */}
      {harvestPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#faf4e6] rounded-2xl p-4 card-shadow-lg max-w-sm w-full pop-in">
            <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#3a2e1e' }}>
              {harvestPrompt.label || '심을 밭 선택'}
            </h3>
            <p className="text-xs font-body text-stone-600 mb-3">
              {BEAN_TYPES[harvestPrompt.card.type].ko}을(를) 심으려면 밭을 선택하세요. 다른 콩이 심어진 밭을 선택하면 수확됩니다.
            </p>
            <div className="mb-3 flex justify-center">
              <BeanCard type={harvestPrompt.card.type} size="md"/>
            </div>
            <div className={`grid gap-2 ${humanPlayer.fields.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {humanPlayer.fields.map((f, i) => (
                <Field
                  key={i}
                  field={f}
                  compact
                  onClick={() => { harvestPrompt.onChoose(i); haptic('medium'); }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Board Overview — shows all players' public state at a glance */}
      {showBoardOverview && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowBoardOverview(false)}>
          <div className="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-[#f5efe0] paper-texture max-h-[92vh] overflow-y-auto slide-up" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#f5efe0]/98 backdrop-blur-sm p-4 border-b border-stone-300 flex items-center justify-between z-10">
              <div>
                <h2 className="font-display text-xl font-bold" style={{ color: '#3a2e1e' }}>전체 보드</h2>
                <div className="text-[10px] font-body text-stone-600">모든 플레이어의 밭·금화·손패</div>
              </div>
              <button onClick={() => setShowBoardOverview(false)} className="p-2 rounded-full hover:bg-stone-200 btn-tactile">
                <X size={18}/>
              </button>
            </div>
            <div className="p-3 space-y-3">
              {state.players.map((p) => {
                const isCurrentTurn = state.players[state.currentPlayerIdx].id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`rounded-xl p-3 card-shadow ${isCurrentTurn ? 'bg-amber-50 ring-2' : 'bg-[#faf4e6]'}`}
                    style={isCurrentTurn ? { boxShadow: `0 0 0 2px ${p.color}` } : {}}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm card-shadow" style={{ background: p.color }}>
                          {p.avatar}
                        </div>
                        <div>
                          <div className="font-body font-semibold text-sm flex items-center gap-1.5" style={{ color: '#3a2e1e' }}>
                            {p.name}
                            {p.isHuman && <span className="text-[9px] font-normal text-stone-500">(나)</span>}
                            {isCurrentTurn && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 rounded">차례</span>}
                          </div>
                          <div className="text-[10px] font-body text-stone-500">
                            손패 {p.hand.length}장 · {p.difficulty === 'human' ? '사람' : p.difficulty === 'easy' ? '초급' : p.difficulty === 'normal' ? '중급' : '고급'}
                          </div>
                        </div>
                      </div>
                      <CoinStack count={p.coins.length} size="md"/>
                    </div>
                    <MiniFieldRow player={p}/>
                    {p.isHuman && (
                      <div className="mt-2">
                        <CollapsibleHand player={p} label="내 손패" defaultOpen={true}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Rulebook */}
      {showRulebook && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowRulebook(false)}>
          <div className="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-[#f5efe0] paper-texture max-h-[90vh] overflow-y-auto slide-up" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#f5efe0]/95 backdrop-blur-sm p-4 border-b border-stone-300 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold" style={{ color: '#3a2e1e' }}>규칙 요약</h2>
              <button onClick={() => setShowRulebook(false)} className="p-2 rounded-full hover:bg-stone-200 btn-tactile">
                <X size={18}/>
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm font-body text-stone-700 leading-relaxed">
              <section>
                <h3 className="font-display font-bold text-base mb-1" style={{ color: '#3a2e1e' }}>🌱 핵심 규칙</h3>
                <p><strong>손패 순서는 바꿀 수 없습니다.</strong> 뽑은 카드는 손의 뒤에, 심는 카드는 맨 앞에서 나갑니다.</p>
              </section>
              <section>
                <h3 className="font-display font-bold text-base mb-1" style={{ color: '#3a2e1e' }}>🎯 턴 진행</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>맨 앞 카드를 반드시 심고, 선택으로 2번째 카드도 심기</li>
                  <li>덱에서 2장을 펼쳐 시장에 공개</li>
                  <li>시장 카드 + 손패로 다른 농부와 자유롭게 거래</li>
                  <li>거래된 카드와 남은 시장 카드를 모두 심기</li>
                  <li>덱 뒤에서 3장을 손 뒷쪽으로 뽑기</li>
                </ol>
              </section>
              <section>
                <h3 className="font-display font-bold text-base mb-1" style={{ color: '#3a2e1e' }}>💰 수확</h3>
                <p>같은 콩을 모은 밭을 수확하면 콩의 종류와 개수에 따라 금화를 얻습니다. 1장인 밭은 다른 밭이 더 크면 수확 불가.</p>
              </section>
              <section>
                <h3 className="font-display font-bold text-base mb-1" style={{ color: '#3a2e1e' }}>🏁 게임 종료</h3>
                <p>덱이 3번 소진되면 게임 종료. 금화가 가장 많은 사람이 승리!</p>
              </section>
              <section>
                <h3 className="font-display font-bold text-base mb-1" style={{ color: '#3a2e1e' }}>🫘 콩 일람</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {BEAN_KEYS.map(k => {
                    const b = BEAN_TYPES[k];
                    return (
                      <div key={k} className="flex items-center gap-2 bg-stone-100 rounded-lg p-2">
                        <BeanGlyph type={k} size={28}/>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs truncate" style={{ color: b.dark }}>{b.ko}</div>
                          <div className="text-[9px] font-mono text-stone-500">{b.total}장 · {b.thresholds.filter(t => t).join('/')}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pop-in">
          <div className={`px-4 py-2 rounded-full font-body font-semibold text-sm card-shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' :
            toast.type === 'error' ? 'bg-rose-600 text-white' :
            'bg-stone-800 text-amber-50'
          }`}>
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ APP ROOT ============
export default function App() {
  const [config, setConfig] = useState(null);
  
  if (!config) {
    return (
      <>
        <GlobalStyle/>
        <SetupScreen onStart={setConfig}/>
      </>
    );
  }
  
  return <GameScreen config={config} onExit={() => setConfig(null)}/>;
}
