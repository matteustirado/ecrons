import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-center border-b border-white/10">
        <h1 className="text-2xl font-black tracking-widest text-white">HEFHUB</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2 p-4">
        <NavLink
          to="/prices-edit"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/70'
            }`
          }
        >
          <span className="material-symbols-outlined">edit_document</span>
          Manutenção
        </NavLink>
        <NavLink
          to="/prices-display"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-white/40 transition-all hover:bg-white/5 hover:text-white/70"
        >
          <span className="material-symbols-outlined">tv</span>
          Tela da TV
        </NavLink>
      </nav>
    </aside>
  );
}