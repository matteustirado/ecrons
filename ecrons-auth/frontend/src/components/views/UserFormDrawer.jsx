import { useState, useEffect, useRef } from 'react'
import { X, KeyRound, User, ToggleLeft, ToggleRight, ShieldAlert, Search, ChevronDown } from 'lucide-react'

const ROLES = [
  { value: 'SUPER', label: 'Super Admin (Acesso Universal)' },
  { value: 'admin-sp', label: 'Admin Geral (SP)' },
  { value: 'admin-rj', label: 'Admin Geral (RJ)' },
  { value: 'admin-bh', label: 'Admin Geral (BH)' },
  { value: 'dj-merman-sp', label: 'Merman - DJ/Músicas (SP)' },
  { value: 'dj-merman-rj', label: 'Merman - DJ/Músicas (RJ)' },
  { value: 'dj-merman-bh', label: 'Merman - DJ/Músicas (BH)' },
  { value: 'game-sp', label: 'Kiosk Público - Game (SP)' },
  { value: 'game-rj', label: 'Kiosk Público - Game (RJ)' },
  { value: 'game-bh', label: 'Kiosk Público - Game (BH)' },
  { value: 'jukebox-sp', label: 'Kiosk Público - Jukebox (SP)' },
  { value: 'jukebox-rj', label: 'Kiosk Público - Jukebox (RJ)' },
  { value: 'jukebox-bh', label: 'Kiosk Público - Jukebox (BH)' }
]

export default function UserFormDrawer({ isOpen, onClose, onSave, userToEdit, isSaving }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    isTotpEnabled: true
  })
  
  const [selectedRoles, setSelectedRoles] = useState([])
  const [prevUser, setPrevUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  if (userToEdit !== prevUser) {
    setPrevUser(userToEdit)
    if (userToEdit) {
      setFormData({
        username: userToEdit.username || '',
        password: '',
        isTotpEnabled: userToEdit.isTotpEnabled ?? true
      })
      setSelectedRoles(userToEdit.role ? userToEdit.role.split(',') : [])
    } else {
      setFormData({
        username: '',
        password: '',
        isTotpEnabled: true
      })
      setSelectedRoles([])
    }
    setSearchTerm('')
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!isOpen) return null

  const availableRoles = ROLES.filter(r => !selectedRoles.includes(r.value))
  const filteredRoles = availableRoles.filter(r => 
    r.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectRole = (value) => {
    setSelectedRoles([...selectedRoles, value])
    setSearchTerm('')
    setIsDropdownOpen(false)
  }

  const handleRemoveRole = (value) => {
    setSelectedRoles(selectedRoles.filter(r => r !== value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ 
      ...formData, 
      role: selectedRoles.join(',') 
    })
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

          <form onSubmit={handleSubmit} className="custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-2">
            
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
                  placeholder="ex: gerente_sp"
                  className="w-full rounded-xl border border-slate-700/50 bg-black/50 py-3 pl-10 pr-4 text-sm font-bold text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
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
                  className="w-full rounded-xl border border-slate-700/50 bg-black/50 py-3 pl-10 pr-4 text-sm font-bold text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-3" ref={dropdownRef}>
              <label className="ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldAlert size={14} />
                Permissões (Roles)
              </label>

              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Buscar permissões..."
                  className="w-full rounded-xl border border-slate-700/50 bg-black/50 py-3 pl-10 pr-10 text-sm font-bold text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-white/5 hover:text-white"
                >
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-56 overflow-y-auto rounded-xl border border-slate-700/50 bg-[#0a0a0a] shadow-xl custom-scrollbar">
                    {filteredRoles.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">Nenhuma permissão encontrada.</div>
                    ) : (
                      filteredRoles.map(role => (
                        <div
                          key={role.value}
                          onClick={() => handleSelectRole(role.value)}
                          className="cursor-pointer border-b border-slate-800/50 px-4 py-3 text-sm font-bold text-slate-300 transition-colors hover:bg-blue-500/10 hover:text-blue-400 last:border-0"
                        >
                          {role.label}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedRoles.map(val => {
                    const roleObj = ROLES.find(r => r.value === val)
                    return (
                      <span key={val} className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 py-1.5 pl-3 pr-1.5 text-xs font-bold tracking-wide text-blue-400">
                        {roleObj ? roleObj.label : val}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRole(val)} 
                          className="flex h-5 w-5 items-center justify-center rounded-md transition-colors hover:bg-blue-500/20 hover:text-blue-300"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-700/30 bg-slate-800/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Exigir Autenticação 2FA</h4>
                  <p className="mt-1 max-w-50 text-xs font-semibold text-slate-400">
                    Desative apenas para totens de uso local público.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isTotpEnabled: !formData.isTotpEnabled })}
                  className={`transition-colors ${formData.isTotpEnabled ? 'text-blue-500' : 'text-slate-600'}`}
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
                disabled={isSaving || selectedRoles.length === 0}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-blue-500 disabled:opacity-50"
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