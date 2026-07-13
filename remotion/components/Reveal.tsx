import { spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Springs its children up into place. `delay` is in frames, scene-relative. */
export const Reveal: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, distance = 40, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.6 },
  });

  return (
    <div
      style={{
        ...style,
        opacity: progress,
        transform: `translateY(${(1 - progress) * distance}px)`,
      }}
    >
      {children}
    </div>
  );
};
