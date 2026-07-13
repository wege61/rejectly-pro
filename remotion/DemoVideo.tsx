import { AbsoluteFill, Series } from "remotion";
import { CallToAction } from "./scenes/CallToAction";
import { Hook } from "./scenes/Hook";
import { ProductTour, BEAT_FRAMES } from "./scenes/ProductTour";
import { Rejection } from "./scenes/Rejection";
import { Transform } from "./scenes/Transform";
import { Turn } from "./scenes/Turn";
import { brand } from "./theme";

/** Scene lengths in frames @30fps. Sum = DEMO_DURATION_IN_FRAMES. */
export const SCENES = {
  hook: 120, // 4s  — problem
  rejection: 240, // 8s  — the bot rejects you
  turn: 120, // 4s  — brand + mechanism
  tour: BEAT_FRAMES * 3, // 15s — real product, 3 steps
  transform: 180, // 6s  — 32% → 98%
  cta: 150, // 5s  — the ask
} as const;

export const DEMO_DURATION_IN_FRAMES = Object.values(SCENES).reduce(
  (total, frames) => total + frames,
  0,
);

export const DemoVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.bg }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.hook}>
        <Hook />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.rejection}>
        <Rejection />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.turn}>
        <Turn />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.tour}>
        <ProductTour />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.transform}>
        <Transform />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.cta}>
        <CallToAction />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
