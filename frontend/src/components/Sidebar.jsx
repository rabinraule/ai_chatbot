function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) {
  return (
    <aside className="w-72 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold">
          AI
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-bold truncate">AI Chatbot</h1>
          <p className="text-slate-400 text-sm">Local AI Assistant</p>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-xl py-3 text-left px-4 mb-4 font-medium"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;

          return (
            <div
              key={session.id}
              className={`group rounded-xl border transition ${
                isActive
                  ? "bg-slate-800 border-slate-700"
                  : "bg-transparent border-transparent hover:bg-slate-800/70"
              }`}
            >
              <button
                onClick={() => onSelectChat(session.id)}
                className="w-full text-left px-3 pt-3 pb-2"
              >
                <div className="text-sm font-medium truncate">{session.title}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {session.messages.length} messages - {formatTime(session.updatedAt)}
                </div>
              </button>

              <div className="px-3 pb-3 flex justify-end">
                <button
                  onClick={() => onDeleteChat(session.id)}
                  className="text-xs text-slate-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 text-xs text-slate-500">Powered by Ollama</div>
    </aside>
  );
}

export default Sidebar;
