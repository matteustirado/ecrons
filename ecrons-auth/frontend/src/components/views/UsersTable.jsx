import { CheckCircle, XCircle, ShieldAlert, UserPlus, Pencil } from 'lucide-react'

export default function UsersTable({ users, searchTerm, onToggleUser, onAddUser, onEditUser }) {
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">Identidade (IAM)</h2>
          <p className="mt-1 text-xs font-semibold text-slate-400">Controle de acessos e permissões do ecossistema.</p>
        </div>
        
        <button 
          onClick={onAddUser}
          className="flex items-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(203,213,225,0.15)] transition-all hover:bg-white active:scale-95"
        >
          <UserPlus size={16} /> Novo Utilizador
        </button>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-700/30 bg-black/20 py-20">
          <ShieldAlert size={48} className="mb-4 text-slate-600" />
          <p className="text-sm font-bold text-slate-400">Nenhum utilizador encontrado.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-700/30 bg-slate-900/20 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-slate-950/50 text-white uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-5 font-black">Username</th>
                <th className="p-5 font-black">Cargo</th>
                <th className="p-5 font-black">Status</th>
                <th className="p-5 font-black text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t border-slate-700/30 hover:bg-white/5 transition-colors">
                  <td className="p-5 text-white font-bold">{u.username}</td>
                  <td className="p-5 font-bold tracking-wide">{u.role}</td>
                  <td className="p-5">
                    <span className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${u.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {u.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-5 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => onEditUser(u)} 
                      className="text-slate-500 transition-colors hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => onToggleUser(u.id, u.isActive)} 
                      className={`transition-colors ${u.isActive ? 'text-slate-400 hover:text-rose-400' : 'text-slate-400 hover:text-emerald-400'}`}
                    >
                      {u.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}