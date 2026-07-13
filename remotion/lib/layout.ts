import { useVideoConfig } from "remotion";

const LANDSCAPE_REFERENCE_WIDTH = 1920;
const VERTICAL_REFERENCE_WIDTH = 1080;

/**
 * Scale factor + orientation for scenes authored against the 1920x1080 stage.
 *
 * Vertical renders use a 1080 reference rather than 1920, so type stays
 * proportionally *larger* in the narrow frame — social crops are watched on a
 * phone, where 1:1 downscaled text would be unreadable.
 */
export const useStage = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const scale =
    width / (isVertical ? VERTICAL_REFERENCE_WIDTH : LANDSCAPE_REFERENCE_WIDTH);

  return {
    isVertical,
    scale,
    /** Scale a px value authored on the 1920x1080 stage. */
    s: (px: number) => px * scale,
    pad: isVertical ? width * 0.07 : width * 0.09,
  };
};
