import { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, Fingerprint } from 'lucide-react';

export function Step1Form({ onSubmit, isPending, theme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password) {
      onSubmit({ username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Username</label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-500"><User size={18} /></div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="oraclu_master"
            autoComplete="username"
            className={theme.inputClasses}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Senha</label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-500"><Lock size={18} /></div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className={theme.inputClasses}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 text-slate-500 transition hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={isPending} className={theme.buttonClasses}>
        {isPending ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <>Continuar <ShieldCheck size={16} /></>
        )}
      </button>
    </form>
  );
}

export function Step2Form({ onSubmit, onCancel, isPending, theme, username }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 6) onSubmit({ code, username });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-center mb-2">
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-600/30 bg-black/50 text-slate-400">
          <Fingerprint size={28} />
          <div className="absolute inset-0 h-1/2 w-full bg-slate-400/20 animate-scan" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-center block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Código do Authenticator</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="w-full rounded-2xl border border-slate-600/30 bg-black/50 py-4 text-center text-2xl font-mono tracking-[0.5em] text-white outline-none transition placeholder:text-slate-700 focus:border-slate-400 focus:bg-black/80 focus:ring-2 focus:ring-slate-400/20"
        />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <button type="submit" disabled={isPending || code.length !== 6} className={theme.buttonClasses}>
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : 'Autenticar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}