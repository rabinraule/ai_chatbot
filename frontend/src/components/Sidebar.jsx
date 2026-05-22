function Sidebar() {
  return (
    <div className="w-72 bg-slate-900/95 border-r border-slate-800 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-sm font-bold">
            AI
          </div>

          <div>
            <h1 className="text-xl font-bold">AI Chatbot</h1>

            <p className="text-slate-400 text-sm">Local AI Assistant</p>
          </div>
        </div>

        <button className="w-full bg-slate-800 hover:bg-slate-700 transition rounded-2xl py-3 text-left px-4 mb-6">
          + New Chat
        </button>
      </div>

      <div className="text-sm text-slate-500">Powered by Ollama</div>
    </div>
  );
}

export default Sidebar;
