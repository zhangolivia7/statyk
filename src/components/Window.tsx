"use client";

// Deterministic pseudo-random building heights so SSR/CSR markup matches
const BUILDING_SEED = [
  0.62, 0.45, 0.7, 0.4, 0.85, 0.55, 0.5, 0.35, 0.6, 0.48, 0.72, 0.4, 0.58,
];

type Props = {
  isDark: boolean;
};

export default function Window({ isDark }: Props) {
  const skyColor = isDark ? "#061e39" : "#7fb3d5";
  const buildingColor = isDark ? "#0c0c0c" : "#1a1a1a";

  return (
    <div className="flex gap-4">
      {/* Side window */}
      <div
        className="border-2 border-dark-gray"
        style={{ width: 140, height: 260, background: skyColor }}
      />

      {/* Main window with skyline */}
      <div
        className="relative border-2 border-dark-gray overflow-hidden"
        style={{ width: 728, height: 239, background: skyColor }}
      >
        <div className="absolute bottom-0 left-0 right-0 flex items-end">
          {BUILDING_SEED.map((h, i) => (
            <div
              key={i}
              className="border border-dark-gray"
              style={{
                width: `${100 / BUILDING_SEED.length}%`,
                height: `${h * 100}%`,
                background: buildingColor,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
