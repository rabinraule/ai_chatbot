function Topbar({ title, personality }) {
  return (
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-md">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold truncate">{title}</h2>
        <p className="text-sm text-slate-400 capitalize">{personality} mode</p>
      </div>

      <button className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-sm">
        Dark
      </button>
    </div>
  );
}

export default Topbar;
