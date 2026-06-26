import { AlertTriangle } from 'lucide-react';

export default function AvisosEditor({ liveState, setLiveState, compact = false }) {
  return (
    <div className={compact ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1' : 'space-y-5'}>
      {!compact && (
        <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-yellow-300">
          <AlertTriangle size={18} />
          Avisos
        </h3>
      )}

      <div className={compact ? 'contents' : 'space-y-5'}>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="w-full">
            <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-widest text-white/40">
              Aviso #{num}
            </label>

            <input
              type="text"
              value={liveState[`aviso${num}`] || ''}
              onChange={(event) =>
                setLiveState((prev) => ({
                  ...prev,
                  [`aviso${num}`]: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-sm font-medium text-white outline-none transition-colors focus:border-yellow-400 md:text-base"
              placeholder="Ex: Valores sujeitos a alteração."
            />
          </div>
        ))}
      </div>
    </div>
  );
}