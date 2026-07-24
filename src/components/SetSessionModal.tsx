"use client";

import { useState } from "react";
import { BREAK_OPTIONS, FOCUS_OPTIONS } from "@/lib/types";

type Props = {
  onStart: (focusMinutes: number, breakMinutes: number) => void;
  onClose: () => void;
};

export default function SetSessionModal({ onStart, onClose }: Props) {
  const [focus, setFocus] = useState<number>(25);
  const [brk, setBrk] = useState<number>(5);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blackish/90"
      onClick={onClose}
    >
      <div
        className="w-[524px] rounded-[10px] border-2 border-dark-gray bg-blackish p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Set focus session"
      >
        <h2 className="text-2xl text-cream mb-6 tracking-wide">
          SET SESSION
        </h2>

        <fieldset className="mb-6">
          <legend className="text-dark-gray text-xl mb-3">FOCUS</legend>
          <div className="flex gap-3">
            {FOCUS_OPTIONS.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setFocus(min)}
                className={`rounded-[10px] border px-4 py-3 text-xl transition-colors ${
                  focus === min
                    ? "border-dark-gray bg-dark-gray/30 text-cream"
                    : "border-dark-gray text-cream/70 hover:text-cream"
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-8">
          <legend className="text-dark-gray text-xl mb-3">BREAK</legend>
          <div className="flex gap-3">
            {BREAK_OPTIONS.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setBrk(min)}
                className={`rounded-[10px] border px-4 py-3 text-xl transition-colors ${
                  brk === min
                    ? "border-dark-gray bg-dark-gray/30 text-cream"
                    : "border-dark-gray text-cream/70 hover:text-cream"
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => onStart(focus, brk)}
          className="w-full rounded-[10px] border border-dark-gray py-4 text-2xl text-cream tracking-wide hover:border-cream transition-colors"
        >
          START
        </button>
      </div>
    </div>
  );
}
