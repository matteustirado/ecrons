import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CategoryMediaEditor({ categoriesMedia, updateCategoryMedia, uploadMedia }) {
  const handleUpload = async (id, file) => {
    if (!file) return;
    const toastId = toast.loading('Processando arquivo na nuvem B2...');
    uploadMedia.mutate(file, {
      onSuccess: (url) => {
        updateCategoryMedia.mutate({ id, mediaUrl: url }, {
          onSuccess: () => toast.update(toastId, { render: 'Mídia atualizada e renderizada na TV.', type: 'success', isLoading: false, autoClose: 2000 }),
          onError: () => toast.update(toastId, { render: 'Erro ao associar arquivo à categoria.', type: 'error', isLoading: false, autoClose: 3000 })
        });
      },
      onError: () => toast.update(toastId, { render: 'Falha crítica no upload para o Bucket.', type: 'error', isLoading: false, autoClose: 3000 })
    });
  };

  const handleFieldChange = (id, field, value) => {
    updateCategoryMedia.mutate({ id, [field]: value }, {
      onSuccess: () => toast.success('Informação visual salva.'),
      onError: () => toast.error('Erro ao atualizar informação visual.')
    });
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {categoriesMedia.map((cat) => (
        <div key={cat.id} className="group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <input
            type="text"
            defaultValue={cat.titulo || ''}
            onBlur={(e) => handleFieldChange(cat.id, 'titulo', e.target.value)}
            className="mb-4 w-full border-b border-transparent bg-transparent pb-1 text-base font-black text-white outline-none transition-colors focus:border-pink-400"
            placeholder="Título"
          />

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-inner">
            {cat.mediaUrl ? (
              cat.mediaUrl.endsWith('.mp4') || cat.mediaUrl.endsWith('.webm') ? (
                <video src={getMediaUrl(cat.mediaUrl)} className="h-full w-full object-cover" autoPlay muted loop />
              ) : (
                <img src={getMediaUrl(cat.mediaUrl)} className="h-full w-full object-cover" alt={cat.titulo} />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20 font-black uppercase tracking-widest">
                Sem mídia
              </div>
            )}

            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <span className="flex flex-col items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                <Upload size={24} />
                Trocar Arquivo
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
            className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs font-medium text-white outline-none transition-colors focus:border-pink-400 md:text-sm"
            placeholder="Aviso da categoria"
          />

          <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            {cat.qtdPessoas} {cat.qtdPessoas === 1 ? 'Pessoa' : 'Pessoas'}
          </p>
        </div>
      ))}
    </div>
  );
}