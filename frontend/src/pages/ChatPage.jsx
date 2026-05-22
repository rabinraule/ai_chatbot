import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatContainer from "../components/ChatContainer";
import InputArea from "../components/InputArea";

const STORAGE_KEY = "ai-chatbot.sessions";

function createSession() {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

function getStoredSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return [createSession()];
}

function createTitle(message) {
  const cleanMessage = message.replace(/\s+/g, " ").trim();
  return cleanMessage.length > 38
    ? `${cleanMessage.slice(0, 38)}...`
    : cleanMessage || "New Chat";
}

function ChatPage() {
  const [sessions, setSessions] = useState(getStoredSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0].id);
  const [personality, setPersonality] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || sessions[0],
    [activeSessionId, sessions]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const startNewChat = () => {
    const session = createSession();

    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    setDraft("");
  };

  const deleteChat = (sessionId) => {
    const remainingSessions = sessions.filter((session) => session.id !== sessionId);
    const fallbackSession = remainingSessions.length > 0 ? null : createSession();

    if (sessionId === activeSessionId) {
      setActiveSessionId(
        remainingSessions.length > 0 ? remainingSessions[0].id : fallbackSession.id
      );
    }

    setSessions((prev) => {
      const nextSessions = prev.filter((session) => session.id !== sessionId);
      return nextSessions.length > 0 ? nextSessions : [fallbackSession];
    });
  };

  const updateMessages = (updater) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== activeSessionId) return session;

        const messages =
          typeof updater === "function" ? updater(session.messages) : updater;
        const firstUserMessage = messages.find((message) => message.sender === "user");

        return {
          ...session,
          title:
            session.title === "New Chat" && firstUserMessage
              ? createTitle(firstUserMessage.text)
              : session.title,
          messages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSession.id}
        onNewChat={startNewChat}
        onSelectChat={setActiveSessionId}
        onDeleteChat={deleteChat}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar title={activeSession.title} personality={personality} />

        <ChatContainer
          messages={activeSession.messages}
          loading={loading}
          onUsePrompt={setDraft}
        />

        <InputArea
          input={draft}
          setInput={setDraft}
          setMessages={updateMessages}
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
