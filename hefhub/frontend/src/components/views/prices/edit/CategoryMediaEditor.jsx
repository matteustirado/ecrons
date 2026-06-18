import { Upload } from 'lucide-react';

export default function CategoryMediaEditor({ categoriesMedia, updateCategoryMedia, uploadMedia }) {
  const handleUpload = async (id, file) => {
    if (!file) return;
    uploadMedia.mutate(file, {
      onSuccess: (url) => {
        updateCategoryMedia.mutate({ id, mediaUrl: url });
      },
    });
  };

  const handleFieldChange = (id, field, value) => {
    updateCategoryMedia.mutate({ id, [field]: value });
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {categoriesMedia.map((cat) => (
        <div key={cat.id} className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <input
            type="text"
            defaultValue={cat.titulo || ''}
            onBlur={(e) => handleFieldChange(cat.id, 'titulo', e.target.value)}
            className="mb-3 w-full border-b border-transparent bg-transparent text-sm font-black text-white outline-none focus:border-pink-400"
            placeholder="Título"
          />

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/50">
            {cat.mediaUrl ? (
              cat.mediaUrl.endsWith('.mp4') || cat.mediaUrl.endsWith('.webm') ? (
                <video src={getMediaUrl(cat.mediaUrl)} className="h-full w-full object-cover" autoPlay muted loop />
              ) : (
                <img src={getMediaUrl(cat.mediaUrl)} className="h-full w-full object-cover" alt={cat.titulo} />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20">
                Sem mídia
              </div>
            )}

            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex flex-col items-center gap-1 text-xs font-black uppercase text-white">
                <Upload size={20} />
                Trocar
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleUpload(cat.id, e.target.files[0])}
              />
            </label>
          </div>

          <input
            type="text"
            defaultValue={cat.avisoCategoria || ''}
            onBlur={(e) => handleFieldChange(cat.id, 'avisoCategoria', e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white outline-none focus:border-pink-400"
            placeholder="Aviso da categoria"
          />

          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-white/30">
            {cat.qtdPessoas} {cat.qtdPessoas === 1 ? 'Pessoa' : 'Pessoas'}
          </p>
        </div>
      ))}
    </div>
  );
}