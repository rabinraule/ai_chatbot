import { useState } from "react";

function formatTimestamp(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function InlineText({ text }) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded bg-slate-950/70 px-1.5 py-0.5 text-sm text-sky-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MarkdownMessage({ text }) {
  const blocks = [];
  const lines = text.split("\n");
  let codeBuffer = [];
  let inCodeBlock = false;

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({ type: "code", value: codeBuffer.join("\n") });
        codeBuffer = [];
      }

      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    blocks.push({ type: "line", value: line });
  });

  if (codeBuffer.length > 0) {
    blocks.push({ type: "code", value: codeBuffer.join("\n") });
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <pre
              key={`${block.type}-${index}`}
              className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100"
            >
              <code>{block.value}</code>
            </pre>
          );
        }

        if (!block.value.trim()) {
          return <div key={`${block.type}-${index}`} className="h-2" />;
        }

        const bulletMatch = block.value.match(/^\s*[-*]\s+(.*)$/);

        if (bulletMatch) {
          return (
            <div key={`${block.type}-${index}`} className="flex gap-2">
              <span className="text-slate-400">-</span>
              <span>
                <InlineText text={bulletMatch[1]} />
              </span>
            </div>
          );
        }

        return (
          <p key={`${block.type}-${index}`}>
            <InlineText text={block.value} />
          </p>
        );
      })}
    </div>
  );
}

function ChatBubble({ message, sender, timestamp }) {
  const [copied, setCopied] = useState(false);
  const isUser = sender === "user";

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group flex items-end gap-3 max-w-[78%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0"
          style={{
            backgroundColor: isUser ? "#2563eb" : "#1e293b",
          }}
        >
          {isUser ? "You" : "AI"}
        </div>

        <div className={isUser ? "items-end" : "items-start"}>
          <div
            className={`px-5 py-4 rounded-2xl text-[15px] leading-7 shadow-lg break-words ${
              isUser
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-slate-800 text-slate-100 rounded-bl-md"
            }`}
          >
            <MarkdownMessage text={message} />
          </div>

          <div
            className={`mt-2 flex items-center gap-3 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <span>{formatTimestamp(timestamp)}</span>
            <button onClick={copyMessage} className="hover:text-slate-300">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
