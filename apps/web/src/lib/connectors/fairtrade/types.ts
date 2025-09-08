export type FairtradeEntity = {
  id: string; // stable identifier to track organisations across sources
  name: string; // human-readable company or organisation name
  country?: string; // ISO country name or code when provided
  entityType?: 'Producer' | 'Trader' | 'Licensee' | 'Unknown'; // standardised role within Fairtrade
  categories: string[]; // certified product categories normalised to kebab-case
  website?: string; // public website for more context
  certificateStatus?: 'certified' | 'suspended' | 'expired' | 'unknown'; // certification state when known
  licenceHolder?: string; // brand owner if different from organisation
};

// Collection wrapper used by external datasets.
// Minimal wrapper shape for datasets that expose an items array.
export type FairtradeCollection = { items: unknown[] };
