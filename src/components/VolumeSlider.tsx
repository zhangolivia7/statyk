"use client";

import { useCallback, useRef } from "react";

type Props = {
  volume: number; // 0-1
  onChange: (v: number) => void;
};

export default function VolumeSlider({ volume, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = 1 - (clientY - rect.top) / rect.height;
      onChange(Math.min(1, Math.max(0, ratio)));
    },
    [onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    setFromClientY(e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientY(e.clientY);
  };
  const handlePointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative rounded-[20px] border-2 border-light-gray bg-blackish cursor-pointer touch-none"
        style={{ width: 36, height: 380 }}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") onChange(Math.min(1, volume + 0.05));
          if (e.key === "ArrowDown") onChange(Math.max(0, volume - 0.05));
        }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-[18px] bg-dark-gray"
          style={{ height: `${volume * 100}%` }}
        />
        <div
          className="absolute rounded-full bg-cream border-2 border-blackish"
          style={{
            width: 46,
            height: 46,
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: `${volume * 100}%`,
          }}
        />
      </div>
      <span className="text-cream text-xl tracking-wide">VOL</span>
    </div>
  );
}
