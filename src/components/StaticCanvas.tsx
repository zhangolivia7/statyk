"use client";

import { useEffect, useRef } from "react";

export default function StaticCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;

        function draw() {
            if (!canvas || !ctx) return;
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const shade = Math.random() * 255;
                imageData.data[i] = shade;
                imageData.data[i + 1] = shade;
                imageData.data[i + 2] = shade;
                imageData.data[i + 3] = 255;
            }
            ctx.putImageData(imageData, 0, 0);
            frameId = requestAnimationFrame(draw);
        }

        frameId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={568}
            height={360}
            style={{ width: "100%", height: "100%", display: "block" }}
        />
    );
}
