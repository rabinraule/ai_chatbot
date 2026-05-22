import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatContainer from "../components/ChatContainer";
import InputArea from "../components/InputArea";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you today?",
    },
  ]);

  const [personality, setPersonality] = useState("friendly");
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />

        <ChatContainer messages={messages} loading={loading} />

        <InputArea
          setMessages={setMessages}
          personality={personality}
          setPersonality={setPersonality}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default ChatPage;
