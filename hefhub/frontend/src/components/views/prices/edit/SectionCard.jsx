import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SectionCard({ title, icon, open, onToggle, children }) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:p-8">
      <button onClick={onToggle} className="flex w-full items-center justify-between outline-none">
        <h2 className="flex items-center gap-3 text-lg font-black text-white md:text-xl">
          {icon}
          {title}
        </h2>
        {open ? <ChevronUp className="text-white/45" size={24} /> : <ChevronDown className="text-white/45" size={24} />}
      </button>
      {open && <div className="mt-6 animate-fade-in md:mt-8">{children}</div>}
    </div>
  );
}