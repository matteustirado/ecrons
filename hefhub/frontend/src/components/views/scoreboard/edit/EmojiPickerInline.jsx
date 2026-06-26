import { useState } from 'react';
import { EMOJI_DATA } from '../../../../constants/KeyboardEmojis';

export default function EmojiPickerInline({ onSelect, onClose, recentEmojis }) {
  const [activeTab, setActiveTab] = useState('recents');

  const categories = [
    { id: 'recents', icon: '🕒', label: 'Recentes', emojis: recentEmojis },
    ...EMOJI_DATA
  ];

  const currentEmojis = categories.find((c) => c.id === activeTab)?.emojis || [];

  return (
    <div className="absolute inset-0 z-50 flex animate-fade-in flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#121212] shadow-2xl">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/60 p-2 backdrop-blur-md">
        <div className="no-scrollbar custom-scrollbar mr-2 flex flex-1 gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex min-w-8 items-center justify-center rounded-xl p-1.5 text-sm transition-all ${
                activeTab === cat.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-white/40 hover:bg-white/10 hover:text-white'
              }`}
              title={cat.label}
            >
              {cat.icon}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-colors hover:bg-rose-600 hover:text-white"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#181818] p-2">
        {currentEmojis.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-white/20">
            <span className="material-symbols-outlined mb-2 text-3xl">sentiment_dissatisfied</span>
            <p className="text-xs">Nenhum emoji recente</p>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-1">
            {currentEmojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(emoji)}
                className="flex aspect-square items-center justify-center rounded-xl text-2xl transition-transform hover:scale-110 hover:bg-white/10 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}