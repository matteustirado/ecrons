import { useState } from 'react'
import { X, Shield, KeyRound, User, ToggleLeft, ToggleRight } from 'lucide-react'

const ROLES = [
  { value: 'super', label: 'Super Admin (Acesso Total)' },
  { value: 'admin', label: 'Administrador (Global)' },
  { value: 'adminsp', label: 'Administrador (SP)' },
  { value: 'adminbh', label: 'Administrador (BH)' },
  { value: 'game', label: 'Operador Game (Global)' },
  { value: 'gamesp', label: 'Operador Game (SP)' },
  { value: 'gamebh', label: 'Operador Game (BH)' },
  { value: 'prices', label: 'Operador Preços (Global)' },
  { value: 'pricesp', label: 'Operador Preços (SP)' },
  { value: 'pricesbh', label: 'Operador Preços (BH)' },
  { value: 'preset', label: 'Operador Presets (Global)' },
  { value: 'presetsp', label: 'Operador Presets (SP)' },
  { value: 'presetbh', label: 'Operador Presets (BH)' },
  { value: 'display', label: 'Gestor de Display (Global)' }
]

export default function UserFormDrawer({ isOpen, onClose, onSave, userToEdit, isSaving }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'pricesp',
    isTotpEnabled: true
  })

  const [prevUser, setPrevUser] = useState(null)
  
  if (userToEdit !== prevUser) {
    setPrevUser(userToEdit)
    if (userToEdit) {
      setFormData({
        username: userToEdit.username || '',
        password: '',
        role: userToEdit.role || 'pricesp',
        isTotpEnabled: userToEdit.isTotpEnabled ?? true
      })
    } else {
      setFormData({
        username: '',
        password: '',
        role: 'pricesp',
        isTotpEnabled: true
      })
    }
  }

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-700/30 bg-[#0a0a0a]/95 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out sm:p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">
                {userToEdit ? 'Editar Usuário' : 'Criar Novo Usuário'} 
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Gestão de acesso e privilégios ao ecossistema.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nome de Usuário
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="ex: operador_portaria_sp"
                  className="w-full rounded-xl border border-slate-700/50 bg-black/50 py-3 pl-10 pr-4 text-sm font-bold text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>Senha</span>
                {userToEdit && <span className="text-slate-600">(Opcional)</span>}
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required={!userToEdit}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={userToEdit ? 'Deixe em branco para manter' : '••••••••'}
                  className="w-full rounded-xl border border-slate-700/50 bg-black/50 py-3 pl-10 pr-4 text-sm font-bold text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Nível de Privilégio (Role)
              </label>
              <div className="relative">
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-slate-700/50 bg-black/50 py-3 pl-10 pr-4 text-sm font-bold text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                >
                  {ROLES.map(role => (
                    <option key={role.value} value={role.value} className="bg-slate-900">
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-700/30 bg-slate-800/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Exigir Autenticação 2FA</h4>
                  <p className="mt-1 max-w-50 text-xs font-semibold text-slate-400">
                    Desative apenas para operadores locais do Hefhub (Bypass Seguro).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isTotpEnabled: !formData.isTotpEnabled })}
                  className={`transition-colors ${formData.isTotpEnabled ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {formData.isTotpEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>
            </div>

          </form>

          <div className="mt-6 border-t border-slate-700/30 pt-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-800 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-emerald-400 disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar Usuário'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}