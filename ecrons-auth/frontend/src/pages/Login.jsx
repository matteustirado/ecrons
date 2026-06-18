import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { useAppTheme } from '../hooks/useAppTheme';
import { Step1Form, Step2Form } from '../components/auth/AuthForms';
import { WelcomeOverlay, RbacOverlay } from '../components/auth/AuthOverlays';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';
  const setAuth = useAuthStore((state) => state.setAuth);

  const { data: currentTheme, isLoading: isLoadingTheme } = useAppTheme(redirectUrl);
  const { state, mutations, actions } = useAuthFlow({ redirectUrl, navigate, setAuth });
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleStep1Submit = (credentials) => {
    if (!credentials.username || !credentials.password) {
      actions.setError('Preencha a identificação e a senha.');
      return;
    }
    setTempUsername(credentials.username);
    mutations.loginStep1.mutate(credentials);
  };

  const handleStep2Submit = ({ code }) => {
    mutations.loginStep2.mutate({ code, username: tempUsername });
  };

  if (isLoadingTheme || !currentTheme) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {currentTheme.background}

      <style>{`
        @keyframes slideRight { 0% { opacity: 0; transform: translateX(-20px); } 20% { opacity: 1; transform: translateX(0); } 80% { opacity: 1; transform: translateX(0); } 100% { opacity: 0; transform: translateX(20px); } }
        .animate-slide-right { animation: slideRight 1.5s ease-in-out forwards; }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-scan { animation: scanline 2s linear infinite; }
      `}</style>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-8 md:px-8">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="hidden lg:block">{currentTheme.leftPanel}</section>

          <section className="mx-auto flex w-full max-w-md flex-col justify-center">
            {currentTheme.mobileHeader}

            <div className={currentTheme.formWrapperClasses}>
              {currentTheme.formBackgroundDecorations}

              <div className="relative z-10 mb-7 text-center">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {state.step === 1 ? currentTheme.texts.step1Title : currentTheme.texts.step2Title}
                </h2>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {state.step === 1 ? currentTheme.texts.step1Subtitle : currentTheme.texts.step2Subtitle}
                </p>
              </div>

              {state.error && (
                <div className="relative z-10 mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-bold text-rose-400">
                  {state.error}
                </div>
              )}

              <div className="relative z-10">
                {state.step === 1 ? (
                  <Step1Form 
                    onSubmit={handleStep1Submit} 
                    isPending={mutations.loginStep1.isPending} 
                    theme={currentTheme} 
                  />
                ) : (
                  <Step2Form 
                    onSubmit={handleStep2Submit} 
                    onCancel={actions.resetFlow} 
                    isPending={mutations.loginStep2.isPending} 
                    theme={currentTheme} 
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <WelcomeOverlay welcomeState={state.welcomeState} theme={currentTheme} isRedirect={!!redirectUrl} />
      <RbacOverlay isBlocked={state.isRbacBlocked} onReset={actions.resetFlow} />
    </div>
  );
}