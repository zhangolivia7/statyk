/** Thin-line perspective wireframe for the room corner — matches the
 *  Figma "Room" illustration's simple two-point perspective. */
export default function RoomBackground() {
  return (
    <svg
      className="absolute inset-0 -z-10 pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="var(--color-dark-gray)" strokeWidth="1" fill="none" opacity="0.7">
        {/* corner where side wall meets front wall */}
        <line x1="270" y1="0" x2="270" y2="900" />
        {/* side-wall floor perspective line */}
        <line x1="0" y1="900" x2="270" y2="330" />
        {/* front wall / floor boundary */}
        <line x1="270" y1="480" x2="1440" y2="480" />
        {/* ceiling perspective line, front wall to lamp corner */}
        <line x1="1040" y1="480" x2="1440" y2="330" />
      </g>
    </svg>
  );
}
