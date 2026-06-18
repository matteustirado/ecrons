import { AlertTriangle } from 'lucide-react';

export default function AvisosEditor({ liveState, setLiveState, compact = false }) {
  return (
    <div className={compact ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : ''}>
      {!compact && (
        <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-300">
          <AlertTriangle size={16} />
          Avisos
        </h3>
      )}

      <div className={compact ? 'contents' : 'space-y-4'}>
        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <label className="mb-1 ml-1 block text-[10px] font-black uppercase text-white/40">
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
              className="w-full rounded-xl border border-white/10 bg-black/35 p-3 text-white outline-none focus:border-yellow-400"
              placeholder="Ex: Valores sujeitos a alteração."
            />
          </div>
        ))}
      </div>
    </div>
  );
}