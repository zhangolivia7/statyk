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
        <div>
            <rect x="395.58" y="451" width="841" height="111.1" fill="#0C0C0C" stroke="#F3EDE5" strokeWidth="2" />
            <p>{now ? formatClock(now) : "--:-- --"}</p>
        </div>
    )
}