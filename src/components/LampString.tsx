"use client";

import { useEffect, useRef } from "react";
import { playClickSound } from "@/lib/playClickSound";

interface LampStringProps {
    onPull: () => void;
    theme?: "dark" | "light";
}

// resting geometry, taken straight from the design: a 335px string hanging
// from (26, 0) down to a 25.5-radius pull handle
const ANCHOR = { x: 26, y: 0 };
const SEGMENT_COUNT = 14;
const REST_LENGTH = 335;
const SEGMENT_LENGTH = REST_LENGTH / SEGMENT_COUNT;
const HANDLE_RADIUS = 25.5;

const GRAVITY = 0.45;
const DAMPING = 0.94;
const CONSTRAINT_PASSES = 6;

// the handle eases toward the pointer instead of teleporting to it every
// move event — keeps a fast mouse jiggle from whipping the whole string
const DRAG_SMOOTHING = 0.35;

// how far past resting length you have to pull before it "clicks"
const PULL_THRESHOLD = 110;

// hard stop on how far down the handle can be dragged, so it can't be
// yanked all the way to the bottom of the screen
const MAX_PULL_DISTANCE = 190;

// floor for the constraint solver's distance calc — without this, two
// segments nearly overlapping (easy to trigger with a fast sideways drag)
// divide by a near-zero distance and the correction blows up, freezing
// the rope at whatever position it last managed to render
const MIN_SEGMENT_DIST = 2;

interface Point {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
}

function makeRestingPoints(): Point[] {
    const points: Point[] = [];
    for (let i = 0; i <= SEGMENT_COUNT; i++) {
        const y = ANCHOR.y + i * SEGMENT_LENGTH;
        points.push({ x: ANCHOR.x, y, oldX: ANCHOR.x, oldY: y });
    }
    return points;
}

export default function LampString({ onPull, theme = "dark" }: LampStringProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const handleRef = useRef<SVGCircleElement>(null);
    const pointsRef = useRef<Point[]>(makeRestingPoints());
    const draggingRef = useRef(false);
    const triggeredRef = useRef(false);
    const dragTargetRef = useRef({ x: ANCHOR.x, y: ANCHOR.y + REST_LENGTH });

    useEffect(() => {
        let frameId: number;

        const tick = () => {
            const points = pointsRef.current;
            const handle = points[points.length - 1];

            if (draggingRef.current) {
                const target = dragTargetRef.current;
                handle.oldX = handle.x;
                handle.oldY = handle.y;
                handle.x += (target.x - handle.x) * DRAG_SMOOTHING;
                handle.y += (target.y - handle.y) * DRAG_SMOOTHING;
            }

            for (let i = 1; i < points.length; i++) {
                if (draggingRef.current && i === points.length - 1) continue;
                const p = points[i];
                const vx = (p.x - p.oldX) * DAMPING;
                const vy = (p.y - p.oldY) * DAMPING;
                p.oldX = p.x;
                p.oldY = p.y;
                p.x += vx;
                p.y += vy + GRAVITY;
            }

            for (let pass = 0; pass < CONSTRAINT_PASSES; pass++) {
                points[0].x = ANCHOR.x;
                points[0].y = ANCHOR.y;

                for (let i = 0; i < points.length - 1; i++) {
                    const a = points[i];
                    const b = points[i + 1];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), MIN_SEGMENT_DIST);
                    const diff = (dist - SEGMENT_LENGTH) / dist;
                    const moveX = dx * 0.5 * diff;
                    const moveY = dy * 0.5 * diff;

                    if (i !== 0) {
                        a.x += moveX;
                        a.y += moveY;
                    }
                    if (!(draggingRef.current && i + 1 === points.length - 1)) {
                        b.x -= moveX;
                        b.y -= moveY;
                    }
                }
            }

            if (draggingRef.current && !triggeredRef.current) {
                const pulledPast = handle.y - (ANCHOR.y + REST_LENGTH);
                if (pulledPast > PULL_THRESHOLD) {
                    triggeredRef.current = true;
                    playClickSound();
                    onPull();
                }
            }

            if (pathRef.current) {
                pathRef.current.setAttribute(
                    "d",
                    "M " + points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")
                );
            }
            if (handleRef.current) {
                handleRef.current.setAttribute("cx", handle.x.toFixed(1));
                handleRef.current.setAttribute("cy", handle.y.toFixed(1));
            }

            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [onPull]);

    const clientToLocal = (clientX: number, clientY: number) => {
        const el = svgRef.current;
        if (!el) return { x: ANCHOR.x, y: ANCHOR.y };
        const rect = el.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * (51 / rect.width),
            y: (clientY - rect.top) * (376 / rect.height),
        };
    };

    // caps how far down the pointer can drag the handle — sideways is
    // left alone, only the pull-down depth is limited
    const clampPullTarget = (local: { x: number; y: number }) => ({
        x: local.x,
        y: Math.min(local.y, ANCHOR.y + REST_LENGTH + MAX_PULL_DISTANCE),
    });

    const handlePointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
        draggingRef.current = true;
        triggeredRef.current = false;
        dragTargetRef.current = clampPullTarget(clientToLocal(e.clientX, e.clientY));
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!draggingRef.current) return;
        // just record where the pointer is — the animation loop eases the
        // handle toward this target instead of snapping to it
        dragTargetRef.current = clampPullTarget(clientToLocal(e.clientX, e.clientY));
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        draggingRef.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    return (
        <svg
            ref={svgRef}
            width="51"
            height="376"
            viewBox="0 0 51 376"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible", touchAction: "none" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <path ref={pathRef} stroke="#747474" strokeWidth="2" fill="none" />
            <circle
                ref={handleRef}
                cx={ANCHOR.x}
                cy={ANCHOR.y + REST_LENGTH}
                r={HANDLE_RADIUS}
                fill={theme === "dark" ? "#F3EDE5" : "#0C0C0C"}
                style={{ cursor: "grab" }}
                onPointerDown={handlePointerDown}
            />
        </svg>
    );
}
