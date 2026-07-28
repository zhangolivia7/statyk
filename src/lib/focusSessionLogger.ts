"use client";

import { supabase } from "./supabaseClient";
import { getAnonId } from "./anonId";

// returns the new row's id (used later to mark it complete), or null if the
// insert failed — logging failures shouldn't ever block the timer itself
export async function startFocusSession(durationMinutes: number, channel: string | null) {
    const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
            anon_id: getAnonId(),
            duration_minutes: durationMinutes,
            channel,
            started_at: new Date().toISOString(),
        })
        .select("id")
        .single();

    if (error) {
        console.error("failed to log focus session start", error);
        return null;
    }
    return data.id as string;
}

export async function completeFocusSession(sessionId: string | null) {
    if (!sessionId) return;

    const { error } = await supabase
        .from("focus_sessions")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", sessionId);

    if (error) {
        console.error("failed to log focus session completion", error);
    }
}
