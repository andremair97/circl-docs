import fs from 'node:fs/promises';
import reportBuilder from 'junit-report-builder';
import { CONNECTORS } from '../src/connectors/registry';
import { runSelfTest } from '../src/connectors/self-test';

async function main() {
  const results = await Promise.all(CONNECTORS.map((c) => runSelfTest(c)));
  const suite = reportBuilder.testSuite().name('connector-selftests');
  for (const r of results) {
    const test = suite.testCase().className(r.id).name(r.label).time(r.elapsedMs / 1000);
    if (r.status !== 'ok') test.failure(r.fixPrompt);
  }
  await fs.mkdir('reports', { recursive: true });
  reportBuilder.writeTo('reports/connector-selftests.xml');
  console.log(`Wrote reports for ${results.length} connectors`);
  if (results.some((r) => r.status === 'fail')) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
