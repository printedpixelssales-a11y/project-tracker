export default function Navigation() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <h1 className="text-xl font-bold text-white">Cipher's Projects</h1>
        </div>
        
        <div className="text-sm text-slate-400">
          Last updated: <span id="timestamp">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </nav>
  );
}
