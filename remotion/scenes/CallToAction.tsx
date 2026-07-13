import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Reveal } from "../components/Reveal";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";

/** Beat 6 — the ask. One offer, one URL, one objection removed. */
export const CallToAction: React.FC = () => {
  const { s, pad } = useStage();

  return (
    <AbsoluteFill>
      <Backdrop tint="teal" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: pad,
          textAlign: "center",
          fontFamily: FONT,
        }}
      >
        <Reveal delay={0}>
          <div
            style={{
              fontSize: s(78),
              fontWeight: 700,
              color: brand.text,
              letterSpacing: -s(3),
              lineHeight: 1.15,
              maxWidth: s(1250),
            }}
          >
            Stop getting auto-rejected.
          </div>
        </Reveal>

        <Reveal delay={14}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: s(14),
              marginTop: s(48),
              padding: `${s(24)}px ${s(56)}px`,
              borderRadius: s(999),
              background: brand.red,
              color: "#fff",
              fontSize: s(38),
              fontWeight: 700,
              boxShadow: `0 ${s(12)}px ${s(50)}px ${brand.red}55, inset 0 1px 0 rgba(255,255,255,0.5)`,
            }}
          >
            Roast my résumé — free
          </div>
        </Reveal>

        <Reveal delay={28}>
          <div
            style={{
              fontSize: s(46),
              fontWeight: 700,
              color: brand.teal,
              marginTop: s(44),
              letterSpacing: s(1),
            }}
          >
            rejectly.pro
          </div>
        </Reveal>

        <Reveal delay={38}>
          <div
            style={{
              fontSize: s(26),
              color: brand.textFaint,
              marginTop: s(16),
            }}
          >
            No credit card required
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
