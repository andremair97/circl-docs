export type ConnectorId =
  | 'ebay'
  | 'ifixit'
  | 'off'
  | 'energystar'
  | 'ecolabel'
  | 'tco'
  | 'cdp'
  | 'fairtrade'
  | 'bcorp'
  | 'libraryofthings';

export type CheckResult = { name: string; ok: boolean; details?: string; hint?: string };
export type SelfTestResult = {
  id: ConnectorId;
  label: string;
  status: 'ok' | 'warn' | 'fail';
  elapsedMs: number;
  checks: CheckResult[];
  envFindings: { key: string; present: boolean }[];
  httpTrace?: {
    url: string;
    status?: number;
    message?: string;
    headers?: Record<string, string>;
    sampleBody?: unknown;
  };
  rateLimit?: { remaining?: number; limit?: number; resetAt?: string };
  fixPrompt: string;
};

export interface ConnectorDefinition<TQuery = any, TResult = any> {
  id: ConnectorId;
  label: string;
  docsUrl?: string;
  requiredEnv: string[];
  sampleQuery?: TQuery;
  fetchSample?: (ctx: {
    env: NodeJS.ProcessEnv;
    fetchImpl: typeof fetch;
  }) => Promise<{ result: TResult; httpTrace?: SelfTestResult['httpTrace'] }>;
  validate?: (result: unknown) => { ok: boolean; message?: string };
}
