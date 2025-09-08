import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Shared Ajv instance so compiled schemas are cached across validators.
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Compiles a JSON Schema and returns a validation function.
export function buildValidator<T = unknown>(schema: object) {
  const validate = ajv.compile<T>(schema);
  return (data: unknown) => {
    const ok = validate(data) as boolean;
    return { ok, message: ok ? undefined : ajv.errorsText(validate.errors) };
  };
}
