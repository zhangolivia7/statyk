"use client";

import { useState } from "react";

type Message = { id: string; text: string; ts: number };

type Props = {
  isShared: boolean;
};

export default function Notepad({ isShared }: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: draft.trim(), ts: Date.now() },
    ]);
    setDraft("");
  };

  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-3">
      {open && (
        <div
          className="w-72 rounded-[10px] border-2 border-dark-gray bg-blackish p-4 mb-1"
          style={{
            backgroundImage: isShared
              ? undefined
              : "repeating-linear-gradient(to bottom, transparent, transparent 27px, var(--color-dark-gray) 28px)",
          }}
        >
          {isShared ? (
            <div className="flex flex-col gap-2">
              <div className="max-h-48 overflow-y-auto flex flex-col gap-2 pr-1">
                {messages.length === 0 && (
                  <p className="text-dark-gray text-sm italic">
                    No notes passed yet.
                  </p>
                )}
                {messages.map((m) => (
                  <p key={m.id} className="text-cream text-sm leading-snug">
                    {m.text}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-dark-gray">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="pass a note..."
                  className="flex-1 bg-transparent text-cream text-sm outline-none placeholder:text-dark-gray"
                />
                <button
                  onClick={sendMessage}
                  className="text-cream text-sm hover:text-light-gray"
                >
                  send
                </button>
              </div>
            </div>
          ) : (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="jot something down..."
              className="w-full h-40 bg-transparent text-cream text-sm leading-[28px] outline-none resize-none placeholder:text-dark-gray"
            />
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={isShared ? "Open shared chat" : "Open notepad"}
          className="flex items-center justify-center rounded-md border-2 border-cream bg-blackish hover:border-light-gray transition-colors"
          style={{ width: 60, height: 60 }}
        >
          {isShared ? <MessageIcon /> : <NoteIcon />}
        </button>
      </div>
    </div>
  );
}

function NoteIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3h10l4 4v14H5V3z"
        stroke="var(--color-cream)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 3v4h4"
        stroke="var(--color-cream)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h8M8 14.5h8M8 18h5"
        stroke="var(--color-cream)"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H6a2 2 0 0 1-2-2V6z"
        stroke="var(--color-cream)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
