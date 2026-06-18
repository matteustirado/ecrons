import { useState } from 'react';
import { Clock, Settings } from 'lucide-react';

export default function DefaultsEditor({ defaults, updateDefault }) {
  const [activeTab, setActiveTab] = useState('semana');

  const handleValueChange = (id, value) => {
    updateDefault.mutate({ id, valor: Number(value) });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="flex items-center gap-2 text-lg font-black text-white">
          <Settings size={20} className="text-blue-300" />
          Preços Padrão
        </h2>

        <div className="flex rounded-2xl border border-white/10 bg-black/40 p-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('semana')}
            className={`flex-1 rounded-xl px-4 py-2 text-xs font-black transition-all md:flex-none ${
              activeTab === 'semana' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            SEG. A SEX.
          </button>
          <button
            onClick={() => setActiveTab('fim_de_semana')}
            className={`flex-1 rounded-xl px-4 py-2 text-xs font-black transition-all md:flex-none ${
              activeTab === 'fim_de_semana' ? 'bg-green-600 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            FIM DE SEMANA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {['manha', 'tarde', 'noite'].map((periodo) => (
          <div key={periodo} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase text-white/50">
              <Clock size={14} />
              {periodo}
            </h3>

            <div className="space-y-3">
              {[1, 2, 3].map((qtd) => {
                const regra = defaults.find(
                  (item) => item.tipoDia === activeTab && item.periodo === periodo && item.qtdPessoas === qtd
                );

                if (!regra) return null;

                return (
                  <div key={regra.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/35 p-3">
                    <span className="text-xs font-black text-white/45">{qtd} P</span>
                    <div className="flex items-center">
                      <span className="mr-1 text-xs text-white/30">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={regra.valor}
                        onBlur={(e) => handleValueChange(regra.id, e.target.value)}
                        className="w-20 bg-transparent text-right font-mono font-black text-white outline-none focus:text-blue-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}