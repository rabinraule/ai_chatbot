import { useEffect, useRef } from "react";

import ChatBubble from "./ChatBubble";

const PROMPTS = [
  "Explain this project like I am new to coding.",
  "Give me three ideas to improve this chatbot.",
  "Write a short friendly welcome message.",
];

function EmptyState({ onUsePrompt }) {
  return (
    <div className="h-full min-h-[420px] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-bold">
          AI
        </div>

        <h2 className="text-3xl font-semibold mb-3">What are we building today?</h2>
        <p className="text-slate-400 mb-8">
          Start a new chat with your local Ollama assistant.
        </p>

        <div className="grid gap-3 sm:grid-cols-3 text-left">
          {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onUsePrompt(prompt)}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm leading-6 text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatContainer({ messages, loading, onUsePrompt }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-5xl mx-auto min-h-full">
        {messages.length === 0 ? (
          <EmptyState onUsePrompt={onUsePrompt} />
        ) : (
          <div className="space-y-8">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                sender={msg.sender}
                message={msg.text}
                timestamp={msg.createdAt}
              />
            ))}

            {loading && <ChatBubble sender="bot" message="Typing..." />}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatContainer;
