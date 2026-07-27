"use client";

import { useEffect, useRef } from "react";

interface KnobProps {
    angle: number;
    onChange?: (angle: number) => void;
    min?: number;
    max?: number;
    theme?: "dark" | "light";
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

// wraps a delta into (-180, 180] so crossing the -180/180 seam
// doesn't register as a giant jump
function normalizeDelta(delta: number) {
    let d = delta % 360;
    if (d > 180) d -= 360;
    if (d <= -180) d += 360;
    return d;
}

export default function Knob({ angle, onChange, min = -135, max = 135, theme = "dark" }: KnobProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const draggingRef = useRef(false);
    const lastPointerAngleRef = useRef(0);
    // tracks the in-progress value synchronously so consecutive pointermove
    // events in the same batch accumulate correctly instead of reading a
    // stale `angle` closure from before React re-renders
    const currentAngleRef = useRef(angle);

    useEffect(() => {
        if (!draggingRef.current) currentAngleRef.current = angle;
    }, [angle]);

    const rawPointerAngle = (clientX: number, clientY: number) => {
        const el = svgRef.current;
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;
        // measured from straight up (matches the tick's un-rotated position), clockwise
        return (Math.atan2(dx, -dy) * 180) / Math.PI;
    };

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        draggingRef.current = true;
        currentAngleRef.current = angle;
        e.currentTarget.setPointerCapture(e.pointerId);
        lastPointerAngleRef.current = rawPointerAngle(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!draggingRef.current) return;
        const current = rawPointerAngle(e.clientX, e.clientY);
        const delta = normalizeDelta(current - lastPointerAngleRef.current);
        lastPointerAngleRef.current = current;
        const next = clamp(currentAngleRef.current + delta, min, max);
        currentAngleRef.current = next;
        onChange?.(next);
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        draggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const knobColor = theme === "dark" ? "#F3EDE5" : "#0C0C0C";
    const shadowColor = theme === "dark" ? "#F3EDE5" : "#0C0C0C";

    return (
        <svg
            ref={svgRef}
            width="73"
            height="73"
            viewBox="0 0 73 73"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: "none", cursor: "grab", filter: `drop-shadow(0px 4px 5px ${shadowColor})` }}
        >
            <circle cx="36.5" cy="36.5" r="35.5" stroke={knobColor} strokeWidth="2" />
            <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "36.5px 36.5px" }}>
                <path d="M37 5L37 20" stroke={knobColor} strokeWidth="2" />
                <circle cx="36.5" cy="36.5" r="12.5" fill={knobColor} />
            </g>
        </svg>
    );
}
