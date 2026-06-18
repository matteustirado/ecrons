import { Activity, Music, Wrench, Globe, Brain, Dumbbell, ShieldAlert, Hexagon, Pencil } from 'lucide-react'

const getAppIcon = (name) => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('merman')) return Music
  if (nameLower.includes('hefhub')) return Wrench
  if (nameLower.includes('empireo')) return Globe
  if (nameLower.includes('oraclu')) return Brain
  if (nameLower.includes('banana')) return Dumbbell
  return Activity
}

export default function AppsGrid({ apps, searchTerm, onToggleApp, onAddApp, onEditApp }) {
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">Cofre de Aplicativos</h2>
          <p className="mt-1 text-xs font-semibold text-slate-400">App de segurança Zero-Trust</p>
        </div>
        
        <button 
          onClick={onAddApp}
          className="flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(203,213,225,0.15)] transition-all hover:bg-white active:scale-95"
        >
          <Hexagon size={16} /> Adicionar App
        </button>
      </div>

      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-700/30 bg-black/20 py-20">
          <ShieldAlert size={48} className="mb-4 text-slate-600" />
          <p className="text-sm font-bold text-slate-400">Nenhum aplicativo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredApps.map((app) => {
            const Icon = getAppIcon(app.name)
            const isOnline = app.isActive

            return (
              <div 
                key={app.id} 
                className={`group relative overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900/30 p-6 backdrop-blur-xl transition-all duration-500 hover:border-slate-500/50 hover:shadow-[0_0_40px_rgba(148,163,184,0.1)] ${!isOnline ? 'grayscale opacity-80' : ''}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-50" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-500/20 bg-linear-to-br from-slate-700 via-slate-800 to-black shadow-lg p-1">
                      {app.logoUrl ? (
                        <img src={app.logoUrl} alt={app.name} className="h-full w-full object-contain" />
                      ) : (
                        <Icon size={24} className={isOnline ? 'text-white/90' : 'text-slate-500'} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white tracking-wide">{app.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{app.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onToggleApp(app.id, app.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isOnline ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isOnline ? 'translate-x-6 shadow-md' : 'translate-x-1 shadow-sm'}`} />
                    </button>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isOnline ? 'Online' : 'Bloqueado'}
                    </span>
                  </div>
                </div>

                {!isOnline && (
                  <div className="relative z-10 mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-400 flex items-center justify-center gap-2">
                    <ShieldAlert size={14} /> Rotas Interrompidas
                  </div>
                )}
                
                <div className="relative z-10 mt-6 flex gap-3">
                  <button 
                    onClick={() => onEditApp(app)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-600/30 bg-slate-800/50 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    <Pencil size={12} /> Editar
                  </button>
                  <button 
                    disabled={!isOnline} 
                    onClick={() => window.open(app.url, '_blank')}
                    className="flex-1 rounded-xl bg-slate-200 py-3 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    Acessar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}