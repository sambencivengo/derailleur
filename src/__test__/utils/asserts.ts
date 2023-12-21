
import assert from "assert";
import { DerailleurError } from "~/utils";

export function checkErrorResponse(errors: DerailleurError[], expectedErrors: boolean = false) {
  assert(Array.isArray(errors), 'Errors on response is not an array');
  expectedErrors ? assert.ok(errors.length > 0, `Expected errors in errors response array.`) : assert.ok(errors.length === 0, `Expected zero errors in errors response array.`);
}