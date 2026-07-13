import { AbsoluteFill } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Reveal } from "../components/Reveal";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";

/** Beat 1 — the cold open. States the problem before naming the product. */
export const Hook: React.FC = () => {
  const { s, pad } = useStage();

  return (
    <AbsoluteFill>
      <Backdrop tint="red" />

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
              fontSize: s(150),
              fontWeight: 700,
              letterSpacing: -s(6),
              color: brand.text,
              lineHeight: 1,
            }}
          >
            6 seconds.
          </div>
        </Reveal>

        <Reveal delay={18}>
          <div
            style={{
              fontSize: s(42),
              color: brand.textDim,
              marginTop: s(32),
              lineHeight: 1.4,
            }}
          >
            That&rsquo;s how long a bot spent on your r&eacute;sum&eacute;.
          </div>
        </Reveal>

        <Reveal delay={45}>
          <div
            style={{
              fontSize: s(42),
              fontWeight: 700,
              color: brand.red,
              marginTop: s(16),
              lineHeight: 1.4,
            }}
          >
            A recruiter never saw it.
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
