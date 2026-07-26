"use client";

import { useEffect, useRef } from "react";

interface UseStaticAudioOptions {
    // 0..1
    volume: number;
    enabled: boolean;
}

export function useStaticAudio({ volume, enabled }: UseStaticAudioOptions) {
    const contextRef = useRef<AudioContext | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);

    // set up the AudioContext + noise source once, on first enable
    useEffect(() => {
        if (!enabled || contextRef.current) return;

        const ctx = new AudioContext();
        const bufferSeconds = 2;
        const buffer = ctx.createBuffer(1, ctx.sampleRate * bufferSeconds, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gain = ctx.createGain();
        gain.gain.value = volume;

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();

        contextRef.current = ctx;
        gainRef.current = gain;
        sourceRef.current = source;

        return () => {
            source.stop();
            ctx.close();
            contextRef.current = null;
            gainRef.current = null;
            sourceRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    // react to volume changes
    useEffect(() => {
        if (!gainRef.current) return;
        gainRef.current.gain.value = volume;
    }, [volume]);
}
