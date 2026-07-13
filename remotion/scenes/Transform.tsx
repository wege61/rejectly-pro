import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { ScoreCounter } from "../components/ScoreCounter";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";
import { ResumePanel } from "./Rejection";

const STRONG_BULLETS = [
  "Led full-stack capstone project",
  "React.js & TypeScript",
  "Won 1st place at Hackathon",
];

/** Beat 5 — the payoff. Same résumé, rewritten, now clearing the filter. */
export const Transform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, pad, isVertical } = useStage();

  // A light sweep crosses the panel as the bullets rewrite themselves.
  const sweep = interpolate(frame, [0, 40], [-40, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweepOpacity = interpolate(frame, [0, 8, 34, 42], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badge = spring({
    frame: frame - 105,
    fps,
    config: { damping: 14, mass: 0.7 },
  });

  return (
    <AbsoluteFill>
      <Backdrop tint="green" />

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
          <ResumePanel strong bullets={STRONG_BULLETS} bulletStart={16} />

          <AbsoluteFill
            style={{ overflow: "hidden", borderRadius: s(28), zIndex: 5 }}
          >
            <div
              style={{
                position: "absolute",
                top: `${sweep}%`,
                left: 0,
                right: 0,
                height: "40%",
                opacity: sweepOpacity,
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.14), transparent)",
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
            from={32}
            to={98}
            startFrame={30}
            durationInFrames={60}
            label="ATS Score"
          />

          <div
            style={{
              transform: `scale(${badge})`,
              opacity: badge,
              padding: `${s(16)}px ${s(36)}px`,
              borderRadius: s(999),
              background: `${brand.green}1F`,
              border: `${s(2)}px solid ${brand.green}`,
              color: brand.greenLight,
              fontSize: s(34),
              fontWeight: 700,
              letterSpacing: s(1),
              whiteSpace: "nowrap",
            }}
          >
            ✓ Passes the filter
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
