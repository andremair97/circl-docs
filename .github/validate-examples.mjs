import { createRequire } from 'module';
import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

const require = createRequire(import.meta.url);
// Use AJV's 2020 build so the 2020-12 meta-schema is preloaded.
const Ajv2020 = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');

const repoRoot = process.cwd();
const examplesGlob = 'examples/**/*.json';
const schemasRoot = path.join(repoRoot, 'schemas');

const ajv = new Ajv2020({
  strict: true,
  allErrors: true
});
addFormats(ajv);

const failures = [];

const loadJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const resolveSchemaPath = (examplePath, data) => {
  // Prefer explicit $schema pointing to a repo-relative path
  if (data && typeof data.$schema === 'string') {
    const s = data.$schema.trim();
    if (s.startsWith('http://') || s.startsWith('https://')) {
      throw new Error(
        `Example ${examplePath} uses remote $schema URL (${s}). Use a repo-relative path instead, e.g. "/schemas/universal/product.json".`
      );
    }
    const rel = s.startsWith('/') ? s.slice(1) : s;
    const abs = path.join(repoRoot, rel);
    if (!existsSync(abs)) throw new Error(`$schema path not found for ${examplePath}: ${abs}`);
    return abs;
  }

  // Fallback: examples/**/foo.json -> schemas/**/foo.json
  const relFromExamples = path.relative(path.join(repoRoot, 'examples'), examplePath);
  const candidate = path.join(schemasRoot, relFromExamples);
  if (existsSync(candidate)) return candidate;

  throw new Error(
    `Cannot resolve schema for example ${examplePath}. Add "$schema": "/schemas/<...>.json" to the example.`
  );
};

const main = async () => {
  const files = await glob(examplesGlob, { nodir: true });
  if (files.length === 0) {
    console.log('No examples found under /examples — skipping.');
    return;
  }

  for (const ex of files) {
    try {
      const abs = path.join(repoRoot, ex);
      const data = loadJson(abs);
      const schemaPath = resolveSchemaPath(abs, data);
      const schema = loadJson(schemaPath);

      const key = schema.$id || schemaPath;
      if (!ajv.getSchema(key)) {
        ajv.addSchema(schema, key);
      }
      const validate = ajv.getSchema(key) || ajv.compile(schema);
      const valid = validate(data);

      if (!valid) {
        failures.push({ example: ex, schema: path.relative(repoRoot, schemaPath), errors: validate.errors });
      } else {
        console.log(`OK  ${ex}  ->  ${path.relative(repoRoot, schemaPath)}`);
      }
    } catch (err) {
      failures.push({ example: ex, schema: '(unresolved)', errors: [{ message: err.message }] });
    }
  }

  if (failures.length) {
    console.error('\nExample validation failures:');
    for (const f of failures) {
      console.error(`\n- Example: ${f.example}`);
      console.error(`  Schema : ${f.schema}`);
      for (const e of f.errors || []) {
        console.error(`  • ${e.instancePath || ''} ${e.message}`);
      }
    }
    process.exit(1);
  } else {
    console.log('\nAll examples validate against their schemas ✅');
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
