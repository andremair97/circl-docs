import { EbayItem } from "./types";

// Normalises raw eBay API items so the UI can rely on a stable shape.
// The eBay API returns a very loose schema, so `any` keeps the extractor resilient.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformEbayItem(raw: any): EbayItem | null {
  if (!raw) return null;
  const id = String(raw.itemId || raw.legacyItemId || raw.item_id || "");
  const title = (raw.title || "").trim();
  if (!id && !title) return null;

  const image = raw.image?.imageUrl || raw.thumbnailImages?.[0]?.imageUrl;
  // Use buy price when available, otherwise fall back to current bid.
  const price = raw.price || raw.currentBidPrice || undefined;

  const buyingOptions = Array.isArray(raw.buyingOptions) ? raw.buyingOptions : [];
  const seller = raw.seller ?
    {
      username: raw.seller.username,
      feedbackPercentage: raw.seller.feedbackPercentage ? Number(raw.seller.feedbackPercentage) : undefined,
      feedbackScore: raw.seller.feedbackScore ? Number(raw.seller.feedbackScore) : undefined,
      topRated: !!raw.seller.topRatedSeller,
    } : undefined;

  // Signal if local pickup is explicitly offered.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pickupEligible = !!raw.shippingOptions?.some((o: any) => o?.shippingCarrierCode === "PICKUP" || o?.localPickup);

  // Surface free returns as a sustainability signal.
  const freeReturns =
    raw.returnTerms?.returnsAccepted && (raw.returnTerms?.refundMethod || raw.returnTerms?.returnWithin);

  // Merge available location parts into a single human readable string.
  const locationParts = [raw.itemLocation?.city, raw.itemLocation?.stateOrProvince, raw.itemLocation?.country]
    .filter(Boolean).join(", ");

  return {
    id: id || title,
    title,
    image,
    url: raw.itemWebUrl || raw.itemHref || "#",
    price,
    condition: raw.condition || raw.itemCondition,
    buyingOptions,
    itemLocation: locationParts || undefined,
    pickupEligible,
    freeReturns: !!freeReturns,
    seller,
  };
}
