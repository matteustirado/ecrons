import { Menu, Search } from 'lucide-react'

export default function Topbar({ setIsSidebarOpen, searchTerm, setSearchTerm }) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-700/30 bg-black/20 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300 lg:hidden">
          <Menu size={24} />
        </button>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Cluster: Production-01</span>
        </div>
      </div>

      <div className="relative w-full max-w-xs md:w-64">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-slate-700/50 bg-black/40 py-2.5 pl-10 pr-4 text-xs font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-slate-400 focus:bg-black/60 focus:ring-1 focus:ring-slate-400/20"
        />
      </div>
    </header>
  )
}