import { useState } from 'react';
import { Upload, ChevronLeft, ChevronRight, Trash2, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import AvisosEditor from './AvisosEditor';

export default function PartyModeEditor({ liveState, setLiveState, uploadMedia }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const banners = liveState.partyBanners || [];
  const hasBanners = banners.length > 0;

  const handleAddBanner = (file) => {
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (url) => {
        setLiveState((prev) => {
          const newBanners = [...(prev.partyBanners || []), url];
          setCurrentIndex(newBanners.length - 1);
          return { ...prev, partyBanners: newBanners };
        });
      },
    });
  };

  const handleRemove = () => {
    setLiveState((prev) => {
      const newBanners = (prev.partyBanners || []).filter((_, idx) => idx !== currentIndex);
      if (currentIndex >= newBanners.length) {
        setCurrentIndex(Math.max(0, newBanners.length - 1));
      }
      return { ...prev, partyBanners: newBanners };
    });
  };

  const nextBanner = () => {
    setCurrentIndex((p) => (p + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((p) => (p === 0 ? banners.length - 1 : p - 1));
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-3xl border border-purple-500/25 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-purple-600 p-3 shadow-lg">
          <PartyPopper className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Modo Festa</h2>
          <p className="text-xs text-white/40">Flyers e avisos exibidos na tela de preços.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-300">
            <Upload size={16} />
            Flyers
          </h3>

          <div className="flex items-start gap-4">
            <label className="flex h-96 flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-500/30 bg-purple-600/10 text-purple-300 transition-all hover:bg-purple-600/20">
              <Upload size={30} />
              <span className="mt-3 text-sm font-black">Adicionar Imagem</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAddBanner(e.target.files[0])}
              />
            </label>

            <div className="group relative h-96 w-64 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black">
              {hasBanners ? (
                <>
                  <img
                    src={getMediaUrl(banners[currentIndex])}
                    className="h-full w-full object-cover"
                    alt="Banner"
                  />

                  {banners.length > 1 && (
                    <>
                      <button
                        onClick={prevBanner}
                        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-purple-600"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextBanner}
                        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-purple-600"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleRemove}
                    className="absolute right-4 top-4 z-20 rounded-full border border-red-400/30 bg-red-600/90 p-2.5 text-white shadow-lg transition-all hover:bg-red-500 active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                  <PartyPopper size={30} />
                  <span className="mt-2 text-[10px] font-black uppercase">Nenhum flyer</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <AvisosEditor liveState={liveState} setLiveState={setLiveState} compact />
      </div>
    </motion.div>
  );
}