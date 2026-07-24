"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  onToggle: () => void;
};

const REST_Y = 0;
const PULL_Y = 60;

export default function LampString({ onToggle }: Props) {
  const y = useMotionValue(REST_Y);
  const springY = useSpring(y, { stiffness: 220, damping: 12, mass: 0.6 });

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: 51, height: 376 }}
    >
      {/* Fixed string from ceiling */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-dark-gray"
        style={{ width: 2, height: 300 }}
      />
      {/* Draggable pull with the knob */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing touch-none"
        style={{ top: 300, y: springY }}
        drag="y"
        dragConstraints={{ top: REST_Y, bottom: PULL_Y }}
        dragElastic={0.15}
        onDrag={(_, info) => y.set(Math.max(0, info.offset.y))}
        onDragEnd={(_, info) => {
          if (info.offset.y > PULL_Y * 0.6) {
            onToggle();
          }
          y.set(REST_Y);
        }}
        role="button"
        aria-label="Pull to toggle light/dark mode"
      >
        <div
          className="rounded-full bg-cream border-2 border-dark-gray"
          style={{ width: 40, height: 40 }}
        />
      </motion.div>
    </div>
  );
}
