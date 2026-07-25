import TV from "@/components/TV";
import Timer from "@/components/Timer"
import Knob from "./Knob"

interface RoomProps {
    channel: string;
}

// Create the component function
export default function Room({ channel }: RoomProps) {
    return (
        <div style={{ position: "relative", width: 844, height: 598 }}>
            <TV color="#0C0C0C" />
            <div
                style={{
                    position: "absolute",
                    left: "8%",
                    top: "81%",
                }}
            >
                <Knob angle="90"/>
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
    );
}