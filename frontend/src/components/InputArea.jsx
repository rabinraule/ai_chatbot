import { useState } from "react";

function InputArea({
  setMessages,
  personality,
  setPersonality,
  loading,
  setLoading,
}) {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const currentInput = input.trim();

    if (!currentInput || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentInput,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          personality,
        }),
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Backend returned a non-JSON response with status ${response.status}.`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.detail || `Backend returned status ${response.status}.`
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.response || "I did not receive a response from the AI model.",
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Failed to connect to the AI server. Make sure the backend and Ollama are running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-slate-800 p-4">
      <div className="max-w-5xl mx-auto flex gap-3">
        <select
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="bg-slate-800 px-4 rounded-2xl outline-none"
        >
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="humorous">Humorous</option>
        </select>

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 bg-slate-800 rounded-2xl px-5 py-4 outline-none min-w-0"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 transition px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default InputArea;
