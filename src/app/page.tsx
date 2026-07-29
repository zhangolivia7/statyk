"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Room from "@/components/Room";
import { generateRoomCode } from "@/lib/roomCode";

export default function Home() {
    const router = useRouter();
    // generated once per visit so the room has a code to share immediately,
    // then the URL is updated to match so the link stays joinable on refresh
    const [code] = useState(() => generateRoomCode());

    useEffect(() => {
        router.replace(`/${code}`);
    }, [code, router]);

    return (
        <div>
            <Room channel="one" roomCode={code} />
        </div>
    );
}
