"use client";

import { useRef } from "react";

interface VolumeProps {
    value: number; // 0..1
    onChange?: (value: number) => void;
    theme?: "dark" | "light";
}

const TRACK_TOP = 1;
const TRACK_BOTTOM = 747;
const THUMB_HEIGHT = 82;
// thumb's own top-edge travel range: pinned to the track top at max volume,
// and to (track bottom - thumb height) at zero, so it never runs off either end
const THUMB_TOP_AT_MAX = TRACK_TOP;
const THUMB_TOP_AT_MIN = TRACK_BOTTOM - THUMB_HEIGHT;

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export default function Volume({ value, onChange, theme = "dark" }: VolumeProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const draggingRef = useRef(false);

    const valueFromPointer = (clientY: number) => {
        const el = svgRef.current;
        if (!el) return value;
        const rect = el.getBoundingClientRect();
        // rendered size can differ from the viewBox (46x748) if this gets scaled via CSS
        const scale = 748 / rect.height;
        const localY = (clientY - rect.top) * scale;
        const thumbTop = clamp(localY - THUMB_HEIGHT / 2, THUMB_TOP_AT_MAX, THUMB_TOP_AT_MIN);
        return (THUMB_TOP_AT_MIN - thumbTop) / (THUMB_TOP_AT_MIN - THUMB_TOP_AT_MAX);
    };

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        onChange?.(valueFromPointer(e.clientY));
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!draggingRef.current) return;
        onChange?.(valueFromPointer(e.clientY));
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        draggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const thumbTop = THUMB_TOP_AT_MIN - value * (THUMB_TOP_AT_MIN - THUMB_TOP_AT_MAX);
    const thumbCenterY = thumbTop + THUMB_HEIGHT / 2;

    const trackFill = theme === "dark" ? "#0C0C0C" : "#F3EDE5";
    const trackStroke = theme === "dark" ? "#C7C5BC" : "#747474";
    const filledFill = theme === "dark" ? "#747474" : "#C7C5BC";
    const accent = theme === "dark" ? "#C7C5BC" : "#747474";

    return (
        <svg
            ref={svgRef}
            width="46"
            height="748"
            viewBox="0 0 46 748"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: "none", cursor: "grab" }}
        >
            {/* bar */}
            <rect x="6" y="1" width="34" height="746" rx="17" fill={trackFill} stroke={trackStroke} strokeWidth="2" />
            {/* filled bar — grows up from the bottom to meet the thumb */}
            <rect
                x="6"
                y={thumbCenterY}
                width="34"
                height={Math.max(0, TRACK_BOTTOM - thumbCenterY)}
                rx="17"
                fill={filledFill}
                stroke={trackStroke}
                strokeWidth="2"
            />
            {/* slider */}
            <rect x="1" y={thumbTop} width="44" height={THUMB_HEIGHT} rx="19" fill={trackFill} stroke={trackStroke} strokeWidth="2" />
            <circle cx="22.5" cy={thumbCenterY} r="11.5" fill={accent} />
        </svg>
    );
}
