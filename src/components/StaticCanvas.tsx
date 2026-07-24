"use client";

import { useEffect, useRef } from "react";
import type { Channel } from "@/lib/types";

type Props = {
  channel: Channel;
  volume: number; // 0-1, drives grain intensity/brightness
  className?: string;
};

/** Renders animated grain onto a canvas, tinted warm/cold per channel. */
export default function StaticCanvas({ channel, volume, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const width = 160;
    const height = 100;
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);

    const draw = () => {
      const buf = imageData.data;
      const intensity = 0.35 + volume * 0.65; // dimmer at low volume
      const warmR = 255;
      const warmG = 230 - channel.warmth * 60;
      const warmB = 210 - channel.warmth * 120;

      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255 * intensity;
        buf[i] = (v * warmR) / 255;
        buf[i + 1] = (v * warmG) / 255;
        buf[i + 2] = (v * warmB) / 255;
        buf[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [channel, volume]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
        display: "block",
      }}
      aria-label={`TV static, ${channel.label} — ${channel.description}`}
      role="img"
    />
  );
}
