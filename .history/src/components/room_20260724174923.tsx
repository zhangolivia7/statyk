import TV from "@/components/TV";

interface RoomProps {
  channel: string;
}

// Create the component function
export default function Room({ channel }: RoomProps) {
  return (
    <div>
        <p>channel</p>
        <TV color="#c32828ff"/>
    </div>
  );
}