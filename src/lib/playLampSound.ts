"use client";

// plays the physical lamp-pull sound effect; which clip depends on which
// direction the theme is switching
export function playLampSound(turningOn: boolean) {
    if (typeof window === "undefined") return;
    const audio = new Audio(turningOn ? "/lamp on.mp3" : "/lamp off.mp3");
    audio.play();
}
