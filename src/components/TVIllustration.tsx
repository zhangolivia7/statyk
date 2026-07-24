type Props = {
  children?: React.ReactNode; // static canvas gets slotted into the screen
};

/** Line-art TV cabinet matching the Figma illustration: a slightly tapered
 *  screen sitting on a wide rectangular base. Screen content is passed as
 *  children so StaticCanvas can render inside the exact screen cutout. */
export default function TVIllustration({ children }: Props) {
  return (
    <div className="relative" style={{ width: 840, height: 571 }}>
      <svg
        className="absolute inset-0"
        width="840"
        height="571"
        viewBox="0 0 840 571"
        fill="none"
        aria-hidden="true"
      >
        {/* screen shell — slightly tapered trapezoid like the Figma art */}
        <path
          d="M110 8 H730 L750 420 H90 Z"
          stroke="var(--color-cream)"
          strokeWidth="2"
          fill="var(--color-blackish)"
        />
        {/* base / console box */}
        <rect
          x="0"
          y="425"
          width="840"
          height="146"
          stroke="var(--color-cream)"
          strokeWidth="2"
          fill="var(--color-blackish)"
        />
      </svg>

      {/* screen cutout — positioned inside the tapered shell above */}
      <div
        className="absolute overflow-hidden rounded-[2px] border border-dark-gray"
        style={{ left: 120, top: 24, width: 600, height: 380 }}
      >
        {children}
      </div>
    </div>
  );
}
