import Room from "@/components/Room";
import { normalizeRoomCode } from "@/lib/roomCode";

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    return (
        <div>
            <Room channel="one" roomCode={normalizeRoomCode(code)} />
        </div>
    );
}
