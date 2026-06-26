export default function HolidayModal({ holidays, newName, newDate, setNewName, setNewDate, onSave, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#121212] flex flex-col">
        <div className="shrink-0 p-4 sm:p-6">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/50 hover:text-white sm:right-6 sm:top-6">
            <span className="material-symbols-outlined">close</span>
          </button>

          <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-white sm:text-2xl">
            <span className="material-symbols-outlined text-yellow-300">event</span>
            Feriados
          </h2>

          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 sm:text-base"
            />

            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400 sm:text-base"
            />

            <button onClick={onSave} className="rounded-xl bg-yellow-600 px-5 py-3 text-xs font-black text-white hover:bg-yellow-500 sm:text-sm">
              ADICIONAR
            </button>
          </div>
        </div>

        <div className="custom-scrollbar grid flex-1 grid-cols-1 gap-3 overflow-y-auto p-4 pt-0 sm:grid-cols-2 sm:gap-4 sm:p-6 sm:pt-0 lg:grid-cols-3">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-black text-white sm:text-base">{holiday.nome}</p>
                <p className="text-[10px] text-white/40 sm:text-xs">
                  {new Date(`${holiday.dataFeriado}T12:00:00Z`).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <button onClick={() => onDelete(holiday.id)} className="text-red-400 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                <span className="material-symbols-outlined text-xl sm:text-2xl">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}