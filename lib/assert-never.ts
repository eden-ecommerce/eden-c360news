/**
 * Exhaustive branch guard for `switch` and `if/else` chains over discriminated unions.
 *
 * @example switch
 * switch (action.type) {
 *   case "create": return handleCreate(action);
 *   default: return assertNever(action);
 * }
 *
 * @example if/else
 * if (s === "a") { ... }
 * else if (s === "b") { ... }
 * else { assertNever(s); }
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}
