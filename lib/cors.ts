/**
 * Shared CORS constants + helpers for API route handlers.
 *
 * The static headers below are also declared in `next.config.ts` so they apply
 * to every `/api/*` response. Route handlers reuse them here to answer the
 * preflight `OPTIONS` request consistently.
 */

/** REPLACE: the single origin allowed to call this app's API. */
export const ALLOWED_ORIGIN = "https://www.eden.co.uk";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

/** Standard response for CORS preflight (`OPTIONS`) requests. */
export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
