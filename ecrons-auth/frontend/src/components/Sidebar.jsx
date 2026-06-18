import { LayoutDashboard, Users, LogOut, User, X } from 'lucide-react'

export default function Sidebar({ view, setView, username, onLogout, isSidebarOpen, setIsSidebarOpen }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700/30 bg-black/40 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-xl p-0.5 shadow-sm">
            <img src="/icon.png" alt="Ecrons System" className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(148,163,184,0.6)]" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">
            Ecrons System
          </h1>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        <p className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Menu Principal</p>
        
        <button 
          onClick={() => setView('apps')} 
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${view === 'apps' ? 'bg-slate-800/50 border border-slate-600/30 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <LayoutDashboard size={18} /> Cofre de Apps
        </button>
        <button 
          onClick={() => setView('users')} 
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${view === 'users' ? 'bg-slate-800/50 border border-slate-600/30 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Users size={18} /> Identidade (IAM)
        </button>
      </nav>

      <div className="border-t border-slate-700/30 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-black/30 p-3 border border-slate-700/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
            <User size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-xs font-black text-white">{username || 'matteustirado'}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Master Level</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-3 text-xs font-black uppercase tracking-widest text-rose-400 transition-colors hover:bg-rose-500/20"
        >
          <LogOut size={16} /> Encerrar Sessão
        </button>

        <div className="my-4 h-px w-full bg-slate-700/30" />

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Developed by</p>
          <p className="text-xs text-slate-300 font-bold mt-0.5">Matteus Tirado</p>
        </div>
      </div>
    </aside>
  )
}