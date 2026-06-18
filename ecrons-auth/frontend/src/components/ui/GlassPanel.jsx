export function GlassPanel({ children, className = '' }) {
  return (
    <div className={`bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl rounded-2xl p-8 w-full ${className}`}>
      {children}
    </div>
  );
}