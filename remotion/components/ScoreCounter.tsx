import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";

/**
 * Animated percentage. Counts between `from` and `to` over the given window,
 * and shifts hue with the value so a bad score literally turns green.
 */
export const ScoreCounter: React.FC<{
  from: number;
  to: number;
  startFrame: number;
  durationInFrames: number;
  label: string;
  size?: number;
}> = ({ from, to, startFrame, durationInFrames, label, size = 180 }) => {
  const frame = useCurrentFrame();
  const { s } = useStage();

  const value = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const rounded = Math.round(value);
  const color =
    rounded >= 80 ? brand.green : rounded >= 50 ? brand.orange : brand.red;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: s(size),
          lineHeight: 1,
          color,
          letterSpacing: -s(6),
          textShadow: `0 0 ${s(60)}px ${color}55`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {rounded}%
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: s(22),
          letterSpacing: s(3),
          textTransform: "uppercase",
          color: brand.textFaint,
          marginTop: s(12),
        }}
      >
        {label}
      </div>
    </div>
  );
};
