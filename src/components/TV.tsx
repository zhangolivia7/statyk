"use client";

import { useEffect, useState } from "react";
import StaticCanvas from "./StaticCanvas";
import TVIllustration from "./TVIllustration";
import type { Channel, SessionPhase } from "@/lib/types";
import { formatCountdown, phaseColor } from "@/lib/useSession";

type Props = {
  channel: Channel;
  onCycleChannel: () => void;
  volume: number;
  phase: SessionPhase;
  secondsRemaining: number;
  onOpenSessionModal: () => void;
};

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Intentional: `now` starts null so server and first client render match
    // (avoids a hydration mismatch), then we fill in the real time once
    // mounted. This one synchronous setState is the standard fix for that.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function TV({
  channel,
  onCycleChannel,
  volume,
  phase,
  secondsRemaining,
  onOpenSessionModal,
}: Props) {
  const now = useClock();

  const isCountingDown = phase === "focus" || phase === "break";
  const display = isCountingDown
    ? formatCountdown(secondsRemaining)
    : now
      ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--";

  const digitColor = phaseColor(phase);

  return (
    <div className="relative select-none">
      <TVIllustration>
        <StaticCanvas channel={channel} volume={volume} />
      </TVIllustration>

      {/* Channel knob — positioned over the base's left side */}
      <button
        type="button"
        onClick={onCycleChannel}
        className="group absolute flex flex-col items-center gap-2 outline-none"
        style={{ left: 55, top: 466 }}
        aria-label={`Change channel, currently ${channel.label}`}
      >
        <span
          className="block rounded-full border-2 border-cream transition-transform duration-300 group-active:rotate-45"
          style={{ width: 71, height: 71 }}
        />
        <span className="text-cream text-xl tracking-wide">CH</span>
      </button>

      {/* Clock / countdown display — positioned over the base's right side */}
      <button
        type="button"
        onClick={onOpenSessionModal}
        className="absolute rounded-[10px] border-2 border-cream px-10 py-4 outline-none hover:border-light-gray transition-colors"
        style={{ left: 222, top: 466, width: 395 }}
        aria-label="Open focus session settings"
      >
        <span
          className="block text-center text-6xl tracking-wider transition-colors duration-500"
          style={{ color: digitColor }}
        >
          {display}
        </span>
      </button>
    </div>
  );
}
