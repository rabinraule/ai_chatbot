function createMessage(sender, text) {
  return {
    id: crypto.randomUUID(),
    sender,
    text,
    createdAt: new Date().toISOString(),
  };
}

function InputArea({
  input,
  setInput,
  setMessages,
  personality,
  setPersonality,
  loading,
  setLoading,
}) {
  const sendMessage = async () => {
    const currentInput = input.trim();

    if (!currentInput || loading) return;

    setMessages((prev) => [...prev, createMessage("user", currentInput)]);

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
        createMessage(
          "bot",
          data.response || "I did not receive a response from the AI model."
        ),
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        createMessage(
          "bot",
          "Failed to connect to the AI server. Make sure the backend and Ollama are running."
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 p-4">
      <div className="max-w-5xl mx-auto flex gap-3 items-end">
        <select
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="h-12 bg-slate-800 px-4 rounded-xl outline-none text-sm"
        >
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="humorous">Humorous</option>
        </select>

        <textarea
          rows={1}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 max-h-36 min-h-12 bg-slate-800 rounded-xl px-5 py-3 outline-none min-w-0 resize-none leading-6"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="h-12 bg-blue-600 hover:bg-blue-500 transition px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
}

export default InputArea;
