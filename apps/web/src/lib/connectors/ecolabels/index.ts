import { ProviderSearchFn } from "./types";
import { searchEuEcolabel } from "./providers/eu-ecolabel/fetch";
import { searchGreenSeal } from "./providers/green-seal/fetch";

export const providers: Record<"EU_ECOLABEL" | "GREEN_SEAL", ProviderSearchFn> = {
  EU_ECOLABEL: searchEuEcolabel,
  GREEN_SEAL: searchGreenSeal,
};
