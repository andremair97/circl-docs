// Types modeling the B Corp directory records. Using explicit optional
// fields keeps the UI resilient when data points are missing.
export type BcorpCompany = {
  id: string;
  name: string;
  status?: "Certified" | "Pending" | "Expired" | string;
  bImpactScore?: number;
  industries: string[];
  country?: string;
  city?: string;
  employeesRange?: string;
  certificationDate?: string; // ISO
  website?: string;
  logo?: string;
  description?: string;
};

// Response shape from Algolia search endpoint.
export type BcorpSearchResponse = { hits?: Record<string, unknown>[] };

// Local fallback sample bundled with the app for offline rendering.
export type BcorpLocalSample = { companies: Record<string, unknown>[] };
