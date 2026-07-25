import Room from "@/components/Room";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-medium">statyk</h1>
      <Room channel="one"/>
    </div>
  );
}
