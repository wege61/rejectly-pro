import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrowserFrame } from "../components/BrowserFrame";
import { Reveal } from "../components/Reveal";
import { useStage } from "../lib/layout";
import { brand, FONT } from "../theme";

export const BEAT_FRAMES = 150;

// Each caption describes what its screenshot actually shows — don't swap a file
// here without re-checking the frame, or the voice-over promises one screen and
// the viewer sees another.
const BEATS = [
  {
    file: "ats-screenshot-1.png",
    eyebrow: "Step 1",
    caption: "See the score the bot gave you.",
  },
  {
    file: "ats-screenshot-2.png",
    eyebrow: "Step 2",
    caption: "Every format, structure and keyword gap — named.",
  },
  {
    file: "reports-detail.png",
    eyebrow: "Step 3",
    caption: "Matched to the exact job. Rewritten by AI.",
  },
];

const TourBeat: React.FC<(typeof BEATS)[number]> = ({
  file,
  eyebrow,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { s, pad, isVertical } = useStage();

  // Slow push-in keeps a static screenshot alive on screen.
  const zoom = interpolate(frame, [0, BEAT_FRAMES], [1, 1.06], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const fadeOut = interpolate(
    frame,
    [BEAT_FRAMES - 14, BEAT_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: pad,
        gap: s(48),
        fontFamily: FONT,
        opacity: fadeOut,
      }}
    >
      <Reveal delay={0} distance={24} style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: s(22),
            fontWeight: 700,
            letterSpacing: s(4),
            textTransform: "uppercase",
            color: brand.teal,
            marginBottom: s(16),
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: s(44),
            fontWeight: 700,
            color: brand.text,
            maxWidth: s(1200),
            lineHeight: 1.3,
          }}
        >
          {caption}
        </div>
      </Reveal>

      <Reveal delay={8} distance={40}>
        <div style={{ transform: `scale(${zoom})` }}>
          <BrowserFrame
            src={staticFile(file)}
            width={s(isVertical ? 1010 : 1180)}
            aspect={16 / 9}
          />
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

/** Beat 4 — the product itself, in three steps of real UI. */
export const ProductTour: React.FC = () => (
  <AbsoluteFill>
    <Backdrop tint="teal" />
    {BEATS.map((beat, i) => (
      <Sequence
        key={beat.file}
        from={i * BEAT_FRAMES}
        durationInFrames={BEAT_FRAMES}
      >
        <TourBeat {...beat} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
