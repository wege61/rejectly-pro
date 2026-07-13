import { useStage } from "../lib/layout";
import { brand, MONO } from "../theme";

/**
 * A résumé bullet as the ATS sees it: rejected (dim, red x) or accepted
 * (white, green check). Same shape in both states so the swap reads as one
 * line being rewritten rather than two separate elements.
 */
export const BulletChip: React.FC<{
  text: string;
  strong: boolean;
  opacity?: number;
}> = ({ text, strong, opacity = 1 }) => {
  const { s } = useStage();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s(12),
        padding: `${s(14)}px ${s(20)}px`,
        borderRadius: s(12),
        fontFamily: MONO,
        fontSize: s(26),
        letterSpacing: -0.2,
        opacity,
        background: strong ? "rgba(255,255,255,0.94)" : "rgba(30,30,35,0.85)",
        color: strong ? "#000000" : brand.textDim,
        boxShadow: strong
          ? `0 ${s(10)}px ${s(30)}px rgba(0,0,0,0.35)`
          : `inset 0 0 0 1px rgba(255,255,255,0.10)`,
      }}
    >
      <span
        style={{
          fontSize: s(24),
          fontWeight: 700,
          color: strong ? brand.green : brand.red,
        }}
      >
        {strong ? "✓" : "✕"}
      </span>
      {text}
    </div>
  );
};
