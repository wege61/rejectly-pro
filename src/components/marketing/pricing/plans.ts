import { PRICING } from "@/lib/constants";

export type PlanId = "single" | "starter" | "pro";

export interface Recommendation {
  plan: PlanId;
  cost: number;
  packs: number;
  singles: number;
}

const SINGLE = PRICING.SINGLE.price;
const PACK = PRICING.STARTER.price;
const PACK_CREDITS = PRICING.STARTER.credits;
const PRO = PRICING.PRO.price;

/**
 * The cheapest honest way to cover `n` applications in a month: any mix of
 * Starter packs and Single credits, or Pro once credits would cost more.
 */
export function cheapest(n: number): Recommendation {
  let best = { cost: Infinity, packs: 0, singles: 0 };
  for (let packs = 0; packs <= Math.ceil(n / PACK_CREDITS); packs++) {
    const singles = Math.max(0, n - packs * PACK_CREDITS);
    const cost = packs * PACK + singles * SINGLE;
    if (cost < best.cost) best = { cost, packs, singles };
  }
  if (best.cost > PRO) return { plan: "pro", cost: PRO, packs: 0, singles: 0 };
  return { plan: best.packs ? "starter" : "single", ...best };
}

export const money = (x: number) => `$${Number.isInteger(x) ? x : x.toFixed(2)}`;

export const PRICES = { single: SINGLE, pack: PACK, packCredits: PACK_CREDITS, pro: PRO };
