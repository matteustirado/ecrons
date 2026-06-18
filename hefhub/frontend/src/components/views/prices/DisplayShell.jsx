export default function DisplayShell({ children, onHiddenClick }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] text-white flex flex-col">
      <div 
        onClick={onHiddenClick}
        className="absolute top-0 right-0 w-24 h-24 z-50 cursor-default"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.24),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(147,51,234,0.22),transparent_32%),radial-gradient(circle_at_45%_90%,rgba(234,179,8,0.15),transparent_36%),linear-gradient(135deg,#050505_0%,#120807_45%,#050505_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-20%] h-[55vw] w-[55vw] -translate-x-1/2 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-[10%] h-112 w-md animate-pulse rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[12%] h-96 w-96 animate-pulse rounded-full bg-purple-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-[20%] h-88 w-88 animate-pulse rounded-full bg-yellow-500/10 blur-3xl" />
      {children}
    </div>
  );
}