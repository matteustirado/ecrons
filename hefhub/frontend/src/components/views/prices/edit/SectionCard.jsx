import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SectionCard({ title, icon, open, onToggle, children }) {
  return (
    <div className="bg-black/30 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl">
      <button onClick={onToggle} className="w-full flex items-center justify-between outline-none">
        <h2 className="text-white font-black text-lg flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {open ? <ChevronUp className="text-white/45" /> : <ChevronDown className="text-white/45" />}
      </button>
      {open && <div className="mt-6 animate-fade-in">{children}</div>}
    </div>
  );
}