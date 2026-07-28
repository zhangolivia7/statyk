"use client";

const SOUND_PATHS = {
    focus: "/focus.mp3",
    break: "/break.mp3",
    complete: "/pomodoro complete.mp3",
} as const;

export function playPomodoroSound(event: keyof typeof SOUND_PATHS) {
    if (typeof window === "undefined") return;
    const audio = new Audio(SOUND_PATHS[event]);
    audio.play();
}
