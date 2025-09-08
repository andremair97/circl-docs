import { ConnectorDefinition, CheckResult, SelfTestResult } from './types';

// Runs a self-test for a connector definition.
export async function runSelfTest(def: ConnectorDefinition): Promise<SelfTestResult> {
  const started = Date.now();
  const envFindings = def.requiredEnv.map((key) => ({ key, present: Boolean(process.env[key]) }));
  const checks: CheckResult[] = [];

  let httpTrace: SelfTestResult['httpTrace'] | undefined;
  let fetchOk = true;
  let validationWarn = false;
  let validationOk = true;
  let sample: unknown = undefined;

  // Wrap fetch to capture basic trace information and enforce 5s timeout.
  const makeFetch = () => {
    let trace: SelfTestResult['httpTrace'];
    const wrapped: typeof fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(input, { ...(init || {}), signal: controller.signal });
        const headers: Record<string, string> = {};
        ['content-type', 'content-length', 'x-ratelimit-remaining', 'x-ratelimit-limit', 'x-ratelimit-reset'].forEach((h) => {
          const v = res.headers.get(h);
          if (v) headers[h] = v;
        });
        let body: unknown = undefined;
        try {
          const data = await res.clone().json();
          body = Array.isArray(data) ? data.slice(0, 2) : data;
        } catch {
          try {
            body = (await res.clone().text()).slice(0, 200);
          } catch {
            // ignore
          }
        }
        trace = { url, status: res.status, headers, sampleBody: body };
        return res;
      } catch (err: any) {
        trace = { url, message: err.message };
        throw err;
      } finally {
        clearTimeout(timer);
        httpTrace = trace;
      }
    };
    return wrapped;
  };

  const envOk = envFindings.every((e) => e.present);

  if (def.fetchSample) {
    const fetchImpl = makeFetch();
    try {
      const { result, httpTrace: trace } = await def.fetchSample({ env: process.env, fetchImpl });
      sample = result;
      if (trace) httpTrace = trace;
      checks.push({ name: 'fetch', ok: true });
    } catch (err: any) {
      fetchOk = false;
      checks.push({ name: 'fetch', ok: false, details: String(err?.message || err) });
    }
  }

  if (def.validate) {
    const res = def.validate(sample);
    validationOk = res.ok;
    validationWarn = res.ok && Boolean(res.message);
    checks.push({ name: 'validate', ok: res.ok, details: res.message });
  }

  let status: SelfTestResult['status'] = 'ok';
  if (!envOk || !fetchOk || !validationOk) status = 'fail';
  else if (validationWarn) status = 'warn';

  let rateLimit: SelfTestResult['rateLimit'];
  if (httpTrace?.headers) {
    rateLimit = {
      remaining: httpTrace.headers['x-ratelimit-remaining'],
      limit: httpTrace.headers['x-ratelimit-limit'],
      resetAt: httpTrace.headers['x-ratelimit-reset'],
    };
  }

  const failing = [
    ...envFindings.filter((e) => !e.present).map((e) => `${e.key} missing`),
    ...checks.filter((c) => !c.ok).map((c) => `${c.name}: ${c.details}`),
  ];
  const fixPrompt = `Connector ${def.id} self-test\n` +
    (failing.length ? `Issues:\n- ${failing.join('\n- ')}\n` : 'All checks passed.\n') +
    (httpTrace ? `Last request: ${httpTrace.url} status ${httpTrace.status}\n` : '');

  return {
    id: def.id,
    label: def.label,
    status,
    elapsedMs: Date.now() - started,
    checks,
    envFindings,
    httpTrace,
    rateLimit,
    fixPrompt,
  };
}
