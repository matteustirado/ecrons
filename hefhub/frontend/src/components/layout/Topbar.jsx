import { useAuthStore } from '../../stores/authStore';

export default function Topbar() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = 'https://auth.dedalosbar.com/login';
  };

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 bg-black/50 px-8 backdrop-blur-xl">
      <div>
        <h2 className="text-lg font-bold text-white/80">Painel de Preços</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white/40">Unidade:</span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-sm font-black text-white">
            {user?.unidade || 'N/A'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/20"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sair
        </button>
      </div>
    </header>
  );
}