interface RoomProps {
  name: string;
  role: string;
}

// Create the component function
export default function Room({ name, role }: RoomProps) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
}