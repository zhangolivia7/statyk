"use client";

import { useEffect, useRef } from "react";
import type { Channel } from "./types";

/**
 * Generates white / pink / brown noise procedurally with the Web Audio API
 * (no audio files to load) and exposes volume + channel controls.
 *
 * Audio only starts after a user gesture, per browser autoplay policy —
 * call `start()` from a click handler (e.g. the first knob turn).
 */
export function useNoise(channel: Channel, volume: number) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startedRef = useRef(false);

  const buildBuffer = (ctx: AudioContext, color: Channel["noiseColor"]) => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (color === "white") {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (color === "pink") {
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        data[i] = pink * 0.11;
      }
    } else {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    return buffer;
  };

  const start = () => {
    if (startedRef.current) return;
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);

    const source = ctx.createBufferSource();
    source.buffer = buildBuffer(ctx, channel.noiseColor);
    source.loop = true;
    source.connect(gain);
    source.start();

    ctxRef.current = ctx;
    gainRef.current = gain;
    sourceRef.current = source;
    startedRef.current = true;
  };

  const stop = () => {
    sourceRef.current?.stop();
    ctxRef.current?.close();
    startedRef.current = false;
  };

  // Swap the buffer when the channel changes (rebuild source; gain node persists)
  useEffect(() => {
    if (!startedRef.current || !ctxRef.current || !gainRef.current) return;
    const ctx = ctxRef.current;
    sourceRef.current?.stop();
    const source = ctx.createBufferSource();
    source.buffer = buildBuffer(ctx, channel.noiseColor);
    source.loop = true;
    source.connect(gainRef.current);
    source.start();
    sourceRef.current = source;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.id]);

  // Live volume updates
  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(
        volume,
        ctxRef.current.currentTime,
        0.05,
      );
    }
  }, [volume]);

  useEffect(() => stop, []);

  return { start, stop };
}
