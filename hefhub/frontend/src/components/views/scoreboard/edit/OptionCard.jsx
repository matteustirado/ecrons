import { useState } from 'react';
import ColorPicker from './ColorPicker';
import EmojiPickerInline from './EmojiPickerInline';
import { COLOR_PALETTE } from '../../../../constants/KeyboardEmojis';

const getMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
};

export default function OptionCard({
  opt,
  index,
  handleOptionChange,
  handleImageUpload,
  setActiveColorPickerIndex,
  activeColorPickerIndex,
  recentEmojis,
  onEmojiSelect,
}) {
  const [activeTab, setActiveTab] = useState('game');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const context = activeTab;
  const tipoKey = `${context}_tipo`;
  const valorKey = `${context}_valor`;
  const isEmoji = opt[tipoKey] === 'emoji';

  return (
    <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/30 hover:shadow-[0_12px_30px_rgba(245,158,11,0.12)]">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-tl from-amber-300/10 via-white/5 to-transparent opacity-60" />

      <div className="relative z-10 flex flex-col">
        <div className="mb-2 flex items-center justify-between px-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome da Opção</label>
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm font-medium text-white outline-none transition-all focus:border-orange-500"
            value={opt.nome || ''}
            onChange={(e) => handleOptionChange(index, 'nome', e.target.value)}
            placeholder={`Opção ${index + 1}`}
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform hover:scale-110"
            style={{ backgroundColor: opt.cor || COLOR_PALETTE[index % COLOR_PALETTE.length] }}
            onClick={() => setActiveColorPickerIndex(activeColorPickerIndex === index ? null : index)}
          />

          {activeColorPickerIndex === index && (
            <ColorPicker
              onSelect={(color) => {
                handleOptionChange(index, 'cor', color);
                setActiveColorPickerIndex(null);
              }}
              onClose={() => setActiveColorPickerIndex(null)}
            />
          )}
        </div>
      </div>

      <div className="group/control relative z-10 flex h-72 flex-col overflow-hidden rounded-xl border border-white/5 bg-black/40 p-2">
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-amber-400/20 blur-2xl" />
        
        <div className="mb-3 flex shrink-0 rounded-lg border border-white/5 bg-black/60 p-1">
          <button
            onClick={() => setActiveTab('game')}
            className={`flex flex-1 items-center justify-center gap-1 rounded py-1.5 text-[9px] font-bold uppercase transition-all ${
              activeTab === 'game' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">sports_esports</span> Game
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex flex-1 items-center justify-center gap-1 rounded py-1.5 text-[9px] font-bold uppercase transition-all ${
              activeTab === 'display' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-xs">tv</span> Placar
          </button>
        </div>

        <div className="mb-3 flex items-center justify-end px-2 shrink-0">
          <div className="flex gap-1 rounded-lg border border-white/5 bg-black/40 p-0.5">
            {['emoji', 'image'].map((type) => (
              <button
                key={type}
                onClick={() => handleOptionChange(index, tipoKey, type)}
                className={`rounded-md px-3 py-1 text-[8px] font-bold uppercase transition-colors ${
                  opt[tipoKey] === type
                    ? 'bg-linear-to-r from-orange-600 to-amber-500 text-white shadow-md'
                    : 'text-white/30 hover:bg-white/5 hover:text-white'
                }`}
              >
                {type === 'emoji' ? 'Emoji' : 'Img'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-black/50">
          {isEmoji ? (
            <span className="select-none text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {opt[valorKey] || '❓'}
            </span>
          ) : opt[valorKey] ? (
            <img src={getMediaUrl(opt[valorKey])} className="h-full w-full object-cover" alt="Preview" />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/20">
              <span className="material-symbols-outlined mb-2 text-4xl">image</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Vazio</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (isEmoji) setShowEmojiPicker(true);
              else document.getElementById(`file-${context}-${index}`).click();
            }}
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/control:opacity-100"
          >
            <span className="material-symbols-outlined text-3xl">edit</span>
          </button>

          {showEmojiPicker && isEmoji && (
            <div className="absolute inset-0 z-20">
              <EmojiPickerInline
                onSelect={(emoji) => {
                  onEmojiSelect(index, context, emoji);
                  setShowEmojiPicker(false);
                }}
                onClose={() => setShowEmojiPicker(false)}
                recentEmojis={recentEmojis}
              />
            </div>
          )}

          <input
            type="file"
            id={`file-${context}-${index}`}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(index, context, e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
}