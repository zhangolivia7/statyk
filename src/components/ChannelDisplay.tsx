"use client";

import { useEffect, useRef } from "react";

interface ChannelDisplayProps {
    video: string;
    audioSrc?: string;
    // gated on the same user gesture as the static noise (browser autoplay policy)
    audioEnabled: boolean;
    // 0..1 — the audio element's `volume` is a DOM property, not an HTML
    // attribute, so it has to be set imperatively rather than passed as JSX prop
    volume: number;
}

export default function ChannelDisplay({ video, audioSrc, audioEnabled, volume }: ChannelDisplayProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
        // audioEnabled must be a dependency too: that's what mounts the
        // <audio> element in the first place, and the ref only attaches once
        // it's actually in the tree
    }, [volume, audioSrc, audioEnabled]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* muted: the video is a silent visual backdrop — actual sound
                comes from the separate audio track below (radio stream or
                ambience file), so browsers' autoplay-requires-muted rule
                doesn't fight what we're already doing */}
            <video
                key={video}
                src={video}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <img
                src="/TV%20Overlay.png"
                alt=""
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.5,
                    pointerEvents: "none",
                }}
            />
            {audioSrc && audioEnabled && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio ref={audioRef} key={audioSrc} src={audioSrc} autoPlay loop />
            )}
        </div>
    );
}
