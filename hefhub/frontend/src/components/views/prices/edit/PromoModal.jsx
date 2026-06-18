import { Upload } from 'lucide-react';

const dayLabels = { 1: 'S', 2: 'T', 3: 'Q', 4: 'Q', 5: 'S', 6: 'S', 0: 'D' };

export default function PromoModal({ promotions, onUpload, onToggleDay, onRemove, onSave, onClose }) {
  const getMediaUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121212]">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1a] p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-white">
            <span className="material-symbols-outlined text-blue-300">campaign</span>
            Promoções
          </h2>

          <button onClick={onClose} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          <label className="mb-6 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-blue-500/50 bg-blue-600/20 p-4 text-xs font-black uppercase tracking-widest text-blue-300 transition-colors hover:bg-blue-600/30">
            <Upload size={20} />
            Adicionar Flyer
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
          </label>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {promotions.map((promo, index) => (
              <div key={index} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]">
                <div className="relative aspect-video">
                  <img
                    src={getMediaUrl(promo.imageUrl)}
                    className="h-full w-full object-cover"
                    alt="Promoção"
                  />
                  <button
                    onClick={() => onRemove(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>

                <div className="flex justify-between gap-1 p-2">
                  {['1', '2', '3', '4', '5', '6', '0'].map((day) => (
                    <button
                      key={day}
                      onClick={() => onToggleDay(index, day)}
                      className={`h-7 w-7 rounded-full text-[10px] font-black ${
                        promo.diasAtivos?.includes(day)
                          ? 'bg-green-500 text-black'
                          : 'bg-white/10 text-white/30'
                      }`}
                    >
                      {dayLabels[day]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 bg-[#1a1a1a] p-4">
          <button
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-500"
          >
            SALVAR PROMOÇÕES
          </button>
        </div>
      </div>
    </div>
  );
}