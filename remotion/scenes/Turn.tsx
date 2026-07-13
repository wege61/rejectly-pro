import { AbsoluteFill, Img, staticFile } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Reveal } from "../components/Reveal";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";

/** Beat 3 — the pivot. Names the product, states the mechanism in one line. */
export const Turn: React.FC = () => {
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
          <Img
            src={staticFile("logo.png")}
            style={{
              width: s(110),
              height: s(110),
              borderRadius: s(26),
              marginBottom: s(30),
            }}
          />
        </Reveal>

        <Reveal delay={10}>
          <div
            style={{
              fontSize: s(64),
              fontWeight: 700,
              color: brand.teal,
              letterSpacing: -s(2),
            }}
          >
            Rejectly<span style={{ color: brand.text }}>.pro</span>
          </div>
        </Reveal>

        <Reveal delay={26}>
          <div
            style={{
              fontSize: s(52),
              fontWeight: 700,
              color: brand.text,
              marginTop: s(36),
              lineHeight: 1.3,
              maxWidth: s(1100),
            }}
          >
            We reverse-engineer the filter that rejected you.
          </div>
        </Reveal>

        <Reveal delay={44}>
          <div
            style={{
              fontSize: s(32),
              color: brand.textDim,
              marginTop: s(24),
              lineHeight: 1.5,
              maxWidth: s(950),
            }}
          >
            Our AI translates your university projects and internships into the
            exact corporate keywords the ATS is scanning for.
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
