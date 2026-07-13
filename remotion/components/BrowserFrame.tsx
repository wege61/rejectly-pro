import { Img } from "remotion";
import { useStage } from "../lib/layout";
import { brand } from "../theme";

const DOTS = ["#FF5F56", "#FFBD2E", "#27C93F"];

/**
 * Wraps a product screenshot in a macOS-style window so real UI reads as a real
 * app rather than a flat image pasted onto a slide.
 */
export const BrowserFrame: React.FC<{
  src: string;
  width: number;
  /** Crop from the top of the image, in image-relative fraction (0–1). */
  focus?: number;
  aspect?: number;
}> = ({ src, width, focus = 0, aspect = 16 / 10 }) => {
  const { s } = useStage();
  const chrome = s(34);
  const height = width / aspect;

  return (
    <div
      style={{
        width,
        borderRadius: s(18),
        overflow: "hidden",
        background: brand.bgPanel,
        border: `1px solid rgba(255,255,255,0.10)`,
        boxShadow: `0 ${s(50)}px ${s(100)}px -${s(20)}px rgba(0,0,0,0.85), 0 0 ${s(
          60,
        )}px -${s(20)}px ${brand.teal}40`,
      }}
    >
      <div
        style={{
          height: chrome,
          display: "flex",
          alignItems: "center",
          gap: s(8),
          paddingLeft: s(14),
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {DOTS.map((color) => (
          <div
            key={color}
            style={{
              width: s(11),
              height: s(11),
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
        ))}
      </div>

      <div style={{ height, overflow: "hidden", position: "relative" }}>
        <Img
          src={src}
          style={{
            width: "100%",
            display: "block",
            transform: `translateY(${-focus * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};
