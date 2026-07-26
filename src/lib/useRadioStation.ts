"use client";

import { useEffect, useState } from "react";

const RADIO_BROWSER_BASE = "https://de1.api.radio-browser.info/json/stations/bytag/";

interface RadioBrowserStation {
    url_resolved: string;
}

// resolves a radio-browser.info tag (e.g. "lofi", "jazz") to a live stream URL.
// pass null to skip fetching (e.g. when no radio channel is active).
export function useRadioStation(tag: string | null) {
    const [streamUrl, setStreamUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!tag) {
            setStreamUrl(null);
            return;
        }

        let cancelled = false;
        setStreamUrl(null);

        const url = `${RADIO_BROWSER_BASE}${encodeURIComponent(tag)}?limit=10&order=clickcount&reverse=true`;

        fetch(url)
            .then((res) => res.json())
            .then((stations: RadioBrowserStation[]) => {
                if (cancelled) return;
                const station = stations.find((s) => s.url_resolved);
                setStreamUrl(station?.url_resolved ?? null);
            })
            .catch(() => {
                // TODO: surface fetch failures (offline, tag with no stations, etc.)
                // rather than silently staying null
                if (!cancelled) setStreamUrl(null);
            });

        return () => {
            cancelled = true;
        };
    }, [tag]);

    return streamUrl;
}
