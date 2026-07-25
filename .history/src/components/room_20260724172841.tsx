interface RoomProps {
  channel: string;
}

// Create the component function
export default function Room({ channel }: RoomProps) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
        <p>channel</p>
    </div>
  );
}