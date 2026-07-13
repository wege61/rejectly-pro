import { loadFont } from "@remotion/fonts";
import { cancelRender, Composition, continueRender, delayRender, staticFile } from "remotion";
import { DemoVideo, DEMO_DURATION_IN_FRAMES } from "./DemoVideo";
import { FONT, FPS } from "./theme";

// Ship the font with the render instead of relying on whatever the rendering
// machine has installed — otherwise CI and a laptop produce different frames.
const fontHandle = delayRender("Loading Roboto");

Promise.all([
  loadFont({
    family: FONT,
    url: staticFile("fonts/Roboto-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: FONT,
    url: staticFile("fonts/Roboto-Bold.ttf"),
    weight: "700",
  }),
])
  .then(() => continueRender(fontHandle))
  .catch((err) => cancelRender(err));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DemoLandscape"
      component={DemoVideo}
      durationInFrames={DEMO_DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="DemoVertical"
      component={DemoVideo}
      durationInFrames={DEMO_DURATION_IN_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
