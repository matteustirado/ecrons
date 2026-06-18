import { ShieldCheck } from 'lucide-react';

const COLOR_PALETTES = {
  slate: {
    gradient: 'from-slate-500/10 via-transparent to-transparent',
    glow: 'bg-slate-500/20',
    textHighlight: 'text-slate-400',
    borderFocus: 'focus:border-slate-400 focus:ring-slate-400/20',
    buttonBg: 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-300'
  },
  rose: {
    gradient: 'from-rose-500/10 via-transparent to-transparent',
    glow: 'bg-rose-500/20',
    textHighlight: 'text-rose-400',
    borderFocus: 'focus:border-rose-400 focus:ring-rose-400/20',
    buttonBg: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
  },
  emerald: {
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
    glow: 'bg-emerald-500/20',
    textHighlight: 'text-emerald-400',
    borderFocus: 'focus:border-emerald-400 focus:ring-emerald-400/20',
    buttonBg: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
  },
  indigo: {
    gradient: 'from-indigo-500/10 via-transparent to-transparent',
    glow: 'bg-indigo-500/20',
    textHighlight: 'text-indigo-400',
    borderFocus: 'focus:border-indigo-400 focus:ring-indigo-400/20',
    buttonBg: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300'
  },
  amber: {
    gradient: 'from-amber-500/10 via-transparent to-transparent',
    glow: 'bg-amber-500/20',
    textHighlight: 'text-amber-400',
    borderFocus: 'focus:border-amber-400 focus:ring-amber-400/20',
    buttonBg: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
  }
};

export const buildTheme = (appData) => {
  const color = appData?.color && COLOR_PALETTES[appData.color] ? appData.color : 'slate';
  const name = appData?.name || 'Ecrons OS';
  const description = appData?.description || 'Autenticação Centralizada Ecrons';
  const logoUrl = appData?.logoUrl || null;
  
  const palette = COLOR_PALETTES[color];

  const DynamicLogo = () => {
    if (logoUrl) {
      return <img src={logoUrl} alt={name} className="h-24 w-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />;
    }
    return (
      <div className={`flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 ${palette.glow} shadow-2xl backdrop-blur-md`}>
        <ShieldCheck size={40} className={palette.textHighlight} />
      </div>
    );
  };

  return {
    name,
    background: (
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-0 left-0 h-full w-full bg-linear-to-br ${palette.gradient}`} />
        <div className={`absolute top-1/4 left-1/4 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full ${palette.glow} blur-[120px]`} />
        <div className={`absolute bottom-0 right-0 h-150 w-150 translate-x-1/3 translate-y-1/3 rounded-full ${palette.glow} blur-[150px] opacity-50`} />
      </div>
    ),
    leftPanel: (
      <div className="flex h-full flex-col justify-center px-12">
        <DynamicLogo />
        <h1 className="mt-8 text-5xl font-black tracking-tighter text-white lg:text-7xl">
          {name}
        </h1>
        <p className={`mt-4 max-w-md text-sm font-semibold uppercase tracking-widest ${palette.textHighlight}`}>
          {description}
        </p>
      </div>
    ),
    mobileHeader: (
      <div className="mb-10 flex flex-col items-center justify-center lg:hidden">
        <DynamicLogo />
        <h1 className="mt-6 text-3xl font-black tracking-tighter text-white">
          {name}
        </h1>
      </div>
    ),
    formWrapperClasses: "relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 shadow-2xl backdrop-blur-3xl sm:p-10",
    formBackgroundDecorations: (
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full ${palette.glow} blur-3xl`} />
        <div className={`absolute -bottom-20 -left-20 h-40 w-40 rounded-full ${palette.glow} blur-3xl`} />
      </div>
    ),
    inputClasses: `w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 ${palette.borderFocus}`,
    buttonClasses: `flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 ${palette.buttonBg} py-3 text-xs font-black uppercase tracking-widest transition active:scale-95`,
    welcomeIcon: <DynamicLogo />,
    textHighlight: palette.textHighlight,
    
    texts: {
      step1Title: appData?.name ? `Acesso ${appData.name}` : 'Acesso Restrito',
      step1Subtitle: appData?.name ? `Credenciais seguras do ${appData.name}` : 'Identifique-se para prosseguir',
      step2Title: 'Autenticação 2FA',
      step2Subtitle: 'Dispositivo de segurança exigido'
    }
  };
};