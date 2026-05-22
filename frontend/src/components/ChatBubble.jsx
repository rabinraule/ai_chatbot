function ChatBubble({ message, sender }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end gap-3 max-w-[75%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-semibold shrink-0"
          style={{
            backgroundColor: isUser ? "#2563eb" : "#1e293b",
          }}
        >
          {isUser ? "You" : "AI"}
        </div>

        <div
          className={`px-5 py-4 rounded-3xl text-[15px] leading-7 shadow-lg whitespace-pre-wrap break-words ${
            isUser
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-slate-800 text-slate-100 rounded-bl-md"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
