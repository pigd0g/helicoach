import React from "react";
import Confetti from "react-confetti-boom";

export default function ConfettiCelebration() {
  return (
    <Confetti
      mode="boom"
      particleCount={300}
      colors={[
        "#10b981",
        "#34d399",
        "#6ee7b7",
        "#a7f3d0",
        "#fbbf24",
        "#f59e0b",
      ]}
      y={0.8}
      launchSpeed={1.5}
      deg={270}
      effectInterval={0}
    />
  );
}
