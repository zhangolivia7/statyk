"use client";

// lazily created so this never runs during SSR and we don't spin up an
// AudioContext until the user actually pulls the cord
let ctx: AudioContext | null = null;

// a short, percussive pitch-drop — reads as a mechanical switch click
export function playClickSound() {
    if (typeof window === "undefined") return;
    if (!ctx) ctx = new AudioContext();

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
}
