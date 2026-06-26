import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#050505] text-white">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="relative z-0 flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 lg:hidden">
          <Topbar setIsSidebarOpen={setIsSidebarOpen} />
        </div>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}