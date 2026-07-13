import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BulletChip } from "../components/BulletChip";
import { Reveal } from "../components/Reveal";
import { ScoreCounter } from "../components/ScoreCounter";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";

export const WEAK_BULLETS = [
  "did a school project",
  "knows coding",
  "wrote some code",
];

const SKELETON_WIDTHS = ["100%", "84%", "92%", "61%"];

/** The résumé panel, scanned then scored. Shared with the Transform scene. */
export const ResumePanel: React.FC<{
  strong: boolean;
  bullets: string[];
  /** Scene-relative frame at which each bullet lands. */
  bulletStart?: number;
}> = ({ strong, bullets, bulletStart = 30 }) => {
  const { s, isVertical } = useStage();

  return (
    <div
      style={{
        width: isVertical ? "100%" : s(760),
        padding: s(44),
        borderRadius: s(28),
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(20,20,22,0.55) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: `inset 0 1.5px 1px rgba(255,255,255,0.18), 0 ${s(50)}px ${s(
          100,
        )}px -${s(20)}px rgba(0,0,0,0.8)`,
        display: "flex",
        flexDirection: "column",
        gap: s(22),
      }}
    >
      <div
        style={{
          height: s(22),
          width: "38%",
          borderRadius: s(6),
          background: "rgba(255,255,255,0.18)",
          marginBottom: s(10),
        }}
      />

      {bullets.map((text, i) => (
        <div
          key={text}
          style={{ display: "flex", flexDirection: "column", gap: s(14) }}
        >
          <div
            style={{
              height: s(11),
              width: SKELETON_WIDTHS[i % SKELETON_WIDTHS.length],
              borderRadius: s(5),
              background: "rgba(255,255,255,0.10)",
            }}
          />
          <Reveal delay={bulletStart + i * 14} distance={12}>
            <BulletChip text={text} strong={strong} />
          </Reveal>
        </div>
      ))}

      <div
        style={{
          height: s(11),
          width: "70%",
          borderRadius: s(5),
          background: "rgba(255,255,255,0.10)",
          marginTop: s(6),
        }}
      />
    </div>
  );
};

/** Beat 2 — the ATS reads the résumé and throws it out. */
export const Rejection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, pad, isVertical } = useStage();

  // Laser sweeps the panel over ~3s, then fades.
  const laserY = interpolate(frame, [10, 100], [-4, 104], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laserOpacity = interpolate(
    frame,
    [10, 20, 92, 102],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const stamp = spring({
    frame: frame - 160,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 120 },
  });

  return (
    <AbsoluteFill>
      <Backdrop tint="red" />

      <AbsoluteFill
        style={{
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? s(60) : s(90),
          padding: pad,
          fontFamily: FONT,
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <ResumePanel strong={false} bullets={WEAK_BULLETS} />

          {/* Scan line, clipped to the panel */}
          <AbsoluteFill
            style={{ overflow: "hidden", borderRadius: s(28), zIndex: 5 }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${laserY}%`,
                height: s(3),
                background: "#fff",
                opacity: laserOpacity,
                boxShadow: `0 0 ${s(14)}px ${s(3)}px rgba(255,255,255,0.8), 0 0 ${s(
                  44,
                )}px ${s(12)}px ${brand.teal}88`,
              }}
            />
          </AbsoluteFill>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(40),
          }}
        >
          <ScoreCounter
            from={0}
            to={32}
            startFrame={110}
            durationInFrames={45}
            label="ATS Score"
          />

          <div
            style={{
              transform: `scale(${interpolate(
                stamp,
                [0, 1],
                [2.4, 1],
              )}) rotate(${interpolate(stamp, [0, 1], [-16, -6])}deg)`,
              opacity: stamp,
              padding: `${s(16)}px ${s(40)}px`,
              border: `${s(4)}px solid ${brand.red}`,
              borderRadius: s(10),
              color: brand.red,
              fontSize: s(52),
              fontWeight: 700,
              letterSpacing: s(4),
            }}
          >
            REJECTED
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
