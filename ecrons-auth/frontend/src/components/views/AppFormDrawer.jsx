import { useState } from 'react'
import { X, Save, Globe, FileText, Palette, Activity, Upload } from 'lucide-react'

export default function AppFormDrawer({ isOpen, onClose, onSave, appToEdit, isSaving }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [color, setColor] = useState('slate')
  const [status, setStatus] = useState('DEVELOPMENT')
  const [logoFile, setLogoFile] = useState(null)

  const [prevContext, setPrevContext] = useState({ isOpen: false, appToEdit: null })

  if (isOpen !== prevContext.isOpen || appToEdit !== prevContext.appToEdit) {
    setPrevContext({ isOpen, appToEdit })
    if (isOpen) {
      setName(appToEdit?.name || '')
      setDescription(appToEdit?.description || '')
      setUrl(appToEdit?.url || '')
      setColor(appToEdit?.color || 'slate')
      setStatus(appToEdit?.status || 'DEVELOPMENT')
      setLogoFile(null)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ name, description, url, color, status, logoFile })
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-slate-700/50 bg-[#0a0a0a]/95 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-500 ease-in-out sm:p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-black text-white">
                {appToEdit ? 'Editar Aplicação' : 'Nova Aplicação'}
              </h2>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Cofre de Apps
              </p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full bg-slate-800/50 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
            <form id="app-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Nome do Aplicativo
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500">
                    <Globe size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Merman"
                    className="w-full rounded-2xl border border-slate-600/30 bg-black/50 py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition focus:border-slate-400 focus:bg-black/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Descrição Curta
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500">
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="App de Músicas do Ecossistema"
                    className="w-full rounded-2xl border border-slate-600/30 bg-black/50 py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition focus:border-slate-400 focus:bg-black/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  URL de Redirecionamento (SSO)
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500">
                    <Globe size={18} />
                  </div>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://merman.dedalosbar.com"
                    className="w-full rounded-2xl border border-slate-600/30 bg-black/50 py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition focus:border-slate-400 focus:bg-black/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Cor Temática do Card
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500">
                    <Palette size={18} />
                  </div>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-600/30 bg-black/50 py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition focus:border-slate-400 focus:bg-black/80"
                  >
                    <option value="slate">Prata Escuro (Padrão)</option>
                    <option value="cyan">Ciano Metálico</option>
                    <option value="orange">Laranja Quente</option>
                    <option value="emerald">Verde Esmeralda</option>
                    <option value="purple">Roxo Neon</option>
                    <option value="yellow">Amarelo Ouro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Status Inicial
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-500">
                    <Activity size={18} />
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-600/30 bg-black/50 py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition focus:border-slate-400 focus:bg-black/80"
                  >
                    <option value="DEVELOPMENT">Em Desenvolvimento</option>
                    <option value="ONLINE">Online / Operacional</option>
                    <option value="MAINTENANCE">Em Manutenção</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Logo do Aplicativo (PNG transparente)
                </label>
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/60 bg-black/30 transition hover:border-slate-500 hover:bg-black/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload size={24} className="mb-2 text-slate-500" />
                      <p className="text-xs font-bold text-slate-400">
                        {logoFile ? logoFile.name : 'Selecionar imagem do logo'}
                      </p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

            </form>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl bg-slate-800/50 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="app-form"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <>
                    <Save size={16} /> Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}