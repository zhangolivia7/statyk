export default function Logo() {
  return (
    <div className="absolute top-3 left-4 flex items-center gap-2">
      <svg width="28" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="1" stroke="var(--color-cream)" strokeWidth="1.5" />
        <rect x="6" y="19" width="12" height="1.5" fill="var(--color-cream)" />
        <rect x="4" y="5" width="4" height="4" fill="#e8c547" />
        <rect x="8" y="5" width="4" height="4" fill="#5aa9e6" />
        <rect x="12" y="5" width="4" height="4" fill="#5ac47e" />
      </svg>
      <span className="text-cream text-2xl tracking-wide">statyk</span>
    </div>
  );
}
