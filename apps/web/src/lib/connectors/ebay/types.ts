export type EbayMoney = { value: string; currency: string };
export type EbaySeller = { username?: string; feedbackPercentage?: number; feedbackScore?: number; topRated?: boolean };
export type EbayItem = {
  id: string;
  title: string;
  image?: string;
  url: string;
  price?: EbayMoney;
  condition?: string;           // e.g., "USED", "NEW", "CERTIFIED_REFURBISHED"
  buyingOptions: string[];      // e.g., ["FIXED_PRICE","AUCTION","BEST_OFFER","BUY_NOW"]
  itemLocation?: string;        // city, state, country
  pickupEligible?: boolean;     // derived from shippingOptions/localPickup
  freeReturns?: boolean;        // derived from returnTerms
  seller?: EbaySeller;
};
// Raw API response has arbitrary shape; `unknown` keeps typing strict.
export type EbaySearchResponse = { itemSummaries?: unknown[] };
