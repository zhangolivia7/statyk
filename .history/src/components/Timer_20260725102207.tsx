"use client";

import { useEffect, useState } from "react";

interface TimerProps {
    pomodoro: boolean,
}

function formatClock(date: Date) {
    const hours24 = date.getHours();
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours24 >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${period}`;
}

export default function Timer({ pomodoro }: TimerProps) {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{ position: "relative", width: 396, height: 112 }}>
            <svg width="396" height="112" viewBox="0 0 396 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="393.581" height="109.095" rx="9" fill="#0C0C0C" stroke="#F3EDE5" stroke-width="2" />
            </svg>
            <p
                style={{
                    position: "absolute",
                    inset: 0,
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48 px"
                }}
            >
                {now ? formatClock(now) : "--:-- --"}
            </p>
        </div>
    )
}