import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}