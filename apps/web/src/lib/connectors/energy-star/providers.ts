import { EnergyStarCategory } from "./types";

type ProviderConfig = {
  envUrl: string;     // name of env var that holds JSON endpoint
};

export const PROVIDERS: Record<EnergyStarCategory, ProviderConfig> = {
  Refrigerators: { envUrl: "ENERGY_STAR_PROVIDER_REFRIGERATORS_URL" },
  Dishwashers:   { envUrl: "ENERGY_STAR_PROVIDER_DISHWASHERS_URL"   },
  Monitors:      { envUrl: "ENERGY_STAR_PROVIDER_MONITORS_URL"      },
} as const;
