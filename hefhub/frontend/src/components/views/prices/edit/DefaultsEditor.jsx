import { useState } from 'react';
import { Clock, Settings } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DefaultsEditor({ defaults, updateDefault }) {
  const [activeTab, setActiveTab] = useState('semana');

  const handleValueChange = (id, value) => {
    updateDefault.mutate({ id, valor: Number(value) }, {
      onSuccess: () => toast.success('Grelha padrão modificada com sucesso.'),
      onError: () => toast.error('Erro ao salvar alteração da grelha padrão.')
    });
  };

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <h2 className="flex items-center gap-3 text-lg font-black text-white md:text-xl">
          <Settings size={24} className="text-blue-300" />
          Preços Padrão Base
        </h2>

        <div className="flex w-full rounded-2xl border border-white/10 bg-black/40 p-1.5 lg:w-auto">
          <button
            onClick={() => setActiveTab('semana')}
            className={`flex-1 rounded-xl px-4 py-3 text-xs font-black tracking-widest transition-all lg:flex-none ${
              activeTab === 'semana' ? 'bg-blue-600 text-white shadow-md' : 'text-white/40 hover:text-white'
            }`}
          >
            SEG. A SEX.
          </button>
          <button
            onClick={() => setActiveTab('fim_de_semana')}
            className={`flex-1 rounded-xl px-4 py-3 text-xs font-black tracking-widest transition-all lg:flex-none ${
              activeTab === 'fim_de_semana' ? 'bg-green-600 text-white shadow-md' : 'text-white/40 hover:text-white'
            }`}
          >
            FIM DE SEMANA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        {['manha', 'tarde', 'noite'].map((periodo) => (
          <div key={periodo} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/50">
              <Clock size={16} />
              {periodo}
            </h3>

            <div className="space-y-4">
              {[1, 2, 3].map((qtd) => {
                const regra = defaults.find(
                  (item) => item.tipoDia === activeTab && item.periodo === periodo && item.qtdPessoas === qtd
                );

                if (!regra) return null;

                return (
                  <div key={regra.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-4">
                    <span className="text-sm font-black text-white/45">{qtd} P</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-white/30">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={regra.valor}
                        onBlur={(e) => handleValueChange(regra.id, e.target.value)}
                        className="w-24 bg-transparent text-right font-mono text-lg font-black text-white outline-none transition-colors focus:text-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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