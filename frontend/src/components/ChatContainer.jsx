import { useEffect, useRef } from "react";

import ChatBubble from "./ChatBubble";

function ChatContainer({ messages, loading }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {messages.map((msg, index) => (
          <ChatBubble key={index} sender={msg.sender} message={msg.text} />
        ))}

        {loading && <ChatBubble sender="bot" message="Typing..." />}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default ChatContainer;
