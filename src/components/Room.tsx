"use client";

import { useState } from "react";
import TV from "@/components/TV";
import Timer from "@/components/Timer"
import Knob from "./Knob"
import StaticCanvas from "./StaticCanvas";
import ChannelDisplay from "./ChannelDisplay";
import { useStaticAudio } from "@/lib/useStaticAudio";
import { useRadioStation } from "@/lib/useRadioStation";
import Volume from "@/components/Volume"

interface RoomProps {
    channel: string;
}

const KNOB_MIN = -135;
const KNOB_MAX = 135;

type ChannelDef =
    | {
        // 0..1 position along the knob sweep where this channel is tuned in
        position: number;
        // silent looping backdrop — actual sound comes from the radio stream
        video: string;
        kind: "radio";
        // genre tag looked up via radio-browser.info
        radioTag: string;
    }
    | {
        position: number;
        video: string;
        kind: "file";
        audioSrc: string;
    };

const CHANNEL_SNAP_TOLERANCE = 0.03;

const CHANNELS: ChannelDef[] = [
    { position: 1 / 6, video: "/channels/lofi.mp4", kind: "radio", radioTag: "lofi" },
    { position: 2 / 6, video: "/channels/jazz.mp4", kind: "radio", radioTag: "jazz" },
    { position: 3 / 6, video: "/channels/ocean.mp4", kind: "file", audioSrc: "/ambience/ocean.mp3" },
    { position: 4 / 6, video: "/channels/night.mp4", kind: "file", audioSrc: "/ambience/night.mp3" },
    { position: 5 / 6, video: "/channels/cafe.mp4", kind: "file", audioSrc: "/ambience/cafe.mp3" },
];

function findActiveChannel(tuningChannel: number) {
    return CHANNELS.find((c) => Math.abs(tuningChannel - c.position) < CHANNEL_SNAP_TOLERANCE);
}

// Create the component function
export default function Room({ channel }: RoomProps) {
    const [tuningAngle, setTuningAngle] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [volume, setVolume] = useState(0.2);

    // normalize the knob's -135..135 sweep to 0..1
    const tuningChannel = (tuningAngle - KNOB_MIN) / (KNOB_MAX - KNOB_MIN);
    const activeChannel = findActiveChannel(tuningChannel);

    // static noise only plays when we're not sitting on a channel
    useStaticAudio({ volume, enabled: audioEnabled && !activeChannel });

    // resolves to a live stream URL only when the active channel is a radio one
    const radioStreamUrl = useRadioStation(activeChannel?.kind === "radio" ? activeChannel.radioTag : null);
    const activeAudioSrc =
        activeChannel?.kind === "radio" ? (radioStreamUrl ?? undefined) : activeChannel?.audioSrc;

    return (
        <div style={{ position: "relative", width: 1440, height: 1024 }}>
            <div style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }}>
                <svg width="1440" height="702" viewBox="0 0 1440 702" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M271 512L-42 701" stroke="#747474" strokeWidth="2" />
                    <path d="M271 512H1440" stroke="#747474" strokeWidth="2" />
                    <path d="M271 512L271 -1.09076e-05" stroke="#747474" strokeWidth="2" />
                    <path d="M-189 130.26L271 64.7604L271 303.761L-189 533.26L-189 130.26Z" fill="#061E39" stroke="#747474" strokeWidth="2" />
                    <path d="M222 136L271 123V303.5L222 328V136Z" fill="#0C0C0C" stroke="#747474" />
                    <path d="M-3 255L27 245V426L-3 441V255Z" fill="#0C0C0C" stroke="#747474" />
                    <path d="M94 132.439L142 125V368L94 393V132.439Z" fill="#0C0C0C" stroke="#747474" />
                    <path d="M27 99.439L94 90V392.5L27 425.5V99.439Z" fill="#0C0C0C" stroke="#747474" />
                    <path d="M142 164.5L222 147V328L142 368V164.5Z" fill="#0C0C0C" stroke="#747474" />
                    <rect x="271" y="65" width="728" height="239" fill="#061E39" stroke="#747474" strokeWidth="2" />
                    <rect x="494" y="197.55" width="56" height="106.45" fill="#0C0C0C" stroke="#747474" />
                    <rect x="638" y="184.132" width="62" height="119.868" fill="#0C0C0C" stroke="#747474" />
                    <rect x="271" y="108" width="49" height="196" fill="#0C0C0C" stroke="#747474" />
                    <rect x="320" y="171.608" width="68" height="132.392" fill="#0C0C0C" stroke="#747474" />
                    <rect x="388" y="138" width="106" height="166" fill="#0C0C0C" stroke="#747474" />
                    <rect x="550" y="115.252" width="44" height="188.748" fill="#0C0C0C" stroke="#747474" />
                    <rect x="594" y="137.616" width="44" height="166.384" fill="#0C0C0C" stroke="#747474" />
                    <rect x="700" y="176.081" width="22" height="127.919" fill="#0C0C0C" stroke="#747474" />
                    <rect x="722" y="126.881" width="67" height="177.119" fill="#0C0C0C" stroke="#747474" />
                    <rect x="789" y="152" width="89" height="152" fill="#0C0C0C" stroke="#747474" />
                    <rect x="878" y="192.183" width="44" height="111.817" fill="#0C0C0C" stroke="#747474" />
                    <rect x="971" y="192.183" width="28" height="111.817" fill="#0C0C0C" stroke="#747474" />
                    <rect x="922" y="126.881" width="49" height="177.119" fill="#0C0C0C" stroke="#747474" />
                </svg>
            </div>
            {/* TV group positioned to match the Figma "TV" frame (x=299, y=324)
                within the same 1440-wide coordinate space as the room background */}
            <div style={{ position: "absolute", left: 299, top: 324, width: 844, height: 598 }}>
                <TV color="#0C0C0C">
                    {activeChannel ? (
                        <ChannelDisplay
                            video={activeChannel.video}
                            audioSrc={activeAudioSrc}
                            audioEnabled={audioEnabled}
                            volume={volume}
                        />
                    ) : (
                        <StaticCanvas />
                    )}
                </TV>
                <div
                    style={{
                        position: "absolute",
                        left: "8%",
                        top: "81%",
                    }}
                >
                    <Knob
                        angle={tuningAngle}
                        onChange={(next) => {
                            setAudioEnabled(true);
                            setTuningAngle(next);
                        }}
                    />
                </div>
                <div
                    style={{
                        position: "absolute",
                        left: "26.7%",
                        top: "78.4%",
                        width: "46.6%",
                        height: "18.2%",
                    }}
                >
                    <Timer pomodoro />
                </div>
            </div>
            {/* positioned to match the Figma "Volume Slider" frame (x=1372, y=152) */}
            <div style={{ position: "absolute", left: 1372, top: 152 }}>
                <Volume value={volume} onChange={setVolume} />
            </div>
        </div>
    );
}