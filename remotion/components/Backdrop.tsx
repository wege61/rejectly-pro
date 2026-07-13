import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../theme";

/**
 * The ambient teal/red glow that the marketing site's hero uses, slowly
 * drifting so static scenes never feel frozen.
 */
export const Backdrop: React.FC<{ tint?: "teal" | "red" | "green" }> = ({
  tint = "teal",
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glow =
    tint === "red" ? brand.red : tint === "green" ? brand.green : brand.teal;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${
            60 + drift * 6
          }% ${20 + drift * 8}%, ${glow}22 0%, ${glow}0A 30%, transparent 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${
            15 - drift * 5
          }% 90%, ${brand.tealDeep}18 0%, transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};
