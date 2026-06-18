export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input
        className="bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 outline-none transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
}