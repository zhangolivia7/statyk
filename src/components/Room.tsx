"use client";

import { useState } from "react";
import TV from "./TV";
import VolumeSlider from "./VolumeSlider";
import LampString from "./LampString";
import Window from "./Window";
import RoomBackground from "./RoomBackground";
import SetSessionModal from "./SetSessionModal";
import Notepad from "./Notepad";
import Logo from "./Logo";
import { CHANNELS } from "@/lib/types";
import { useSession } from "@/lib/useSession";
import { useNoise } from "@/lib/useNoise";

export default function Room() {
  const [channelIndex, setChannelIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isDark, setIsDark] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isShared] = useState(false); // wire up to real session-sharing later

  const channel = CHANNELS[channelIndex];
  const { state, start } = useSession();
  const { start: startAudio } = useNoise(channel, volume);

  const cycleChannel = () => {
    startAudio(); // satisfies the browser's user-gesture requirement for audio
    setChannelIndex((i) => (i + 1) % CHANNELS.length);
  };

  const handleVolumeChange = (v: number) => {
    startAudio();
    setVolume(v);
  };

  return (
    <main
      className="relative w-screen h-screen overflow-hidden transition-colors duration-700"
      style={{
        background: isDark ? "var(--color-blackish)" : "#1c1c1c",
      }}
    >
      <RoomBackground />
      <Logo />

      {/* Ceiling lamp string, top right */}
      <div className="absolute top-0 right-16">
        <LampString onToggle={() => setIsDark((d) => !d)} />
      </div>

      {/* Windows, upper left */}
      <div className="absolute left-6 top-10">
        <Window isDark={isDark} />
      </div>

      {/* Volume slider, right edge */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2">
        <VolumeSlider volume={volume} onChange={handleVolumeChange} />
      </div>

      {/* TV, centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%]">
        <TV
          channel={channel}
          onCycleChannel={cycleChannel}
          volume={volume}
          phase={state.phase}
          secondsRemaining={state.secondsRemaining}
          onOpenSessionModal={() => setModalOpen(true)}
        />
      </div>

      <Notepad isShared={isShared} />

      {modalOpen && (
        <SetSessionModal
          onClose={() => setModalOpen(false)}
          onStart={(focusMinutes, breakMinutes) => {
            start({ focusMinutes, breakMinutes });
            setModalOpen(false);
          }}
        />
      )}
    </main>
  );
}
