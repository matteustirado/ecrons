export default function HolidayModal({ holidays, newName, newDate, setNewName, setNewDate, onSave, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#121212] p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-white/50 hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-white">
          <span className="material-symbols-outlined text-yellow-300">event</span>
          Feriados
        </h2>

        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-400"
          />

          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-yellow-400"
          />

          <button onClick={onSave} className="rounded-xl bg-yellow-600 px-5 py-3 font-black text-white hover:bg-yellow-500">
            ADICIONAR
          </button>
        </div>

        <div className="custom-scrollbar grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="font-black text-white">{holiday.nome}</p>
                <p className="text-xs text-white/40">
                  {new Date(`${holiday.dataFeriado}T12:00:00Z`).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <button onClick={() => onDelete(holiday.id)} className="text-red-400 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}