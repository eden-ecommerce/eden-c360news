import "server-only";

/**
 * Server-only environment access. Private constants MUST live in `.env` and be
 * read here — never hardcode secrets in source or expose via `NEXT_PUBLIC_*`.
 */

export interface ServerEnv {
  readonly API_SECRET_KEY: string | undefined;
  readonly WEBHOOK_SIGNING_SECRET: string | undefined;
  readonly API_KEY: string | undefined;
  readonly SANITY_PREVIEW_TOKEN: string | undefined;
  readonly EDEN_PAYMENT_CLIENT_ID: string | undefined;
  readonly EDEN_PAYMENT_CLIENT_SECRET: string | undefined;
  readonly EDEN_SANITY_PROJECT_ID: string | undefined;
  readonly EDEN_SANITY_DATASET: string | undefined;
  readonly EDEN_SANITY_API_DEVELOPER_TOKEN: string | undefined;
}

/** Read private env vars. Returns `undefined` for unset keys — validate before use. */
export function getServerEnv(): ServerEnv {
  return {
    API_SECRET_KEY: process.env.API_SECRET_KEY,
    WEBHOOK_SIGNING_SECRET: process.env.WEBHOOK_SIGNING_SECRET,
    API_KEY: process.env.API_KEY,
    SANITY_PREVIEW_TOKEN: process.env.SANITY_PREVIEW_TOKEN,
    EDEN_PAYMENT_CLIENT_ID: process.env.EDEN_PAYMENT_CLIENT_ID,
    EDEN_PAYMENT_CLIENT_SECRET: process.env.EDEN_PAYMENT_CLIENT_SECRET,
    EDEN_SANITY_PROJECT_ID: process.env.EDEN_SANITY_PROJECT_ID,
    EDEN_SANITY_DATASET: process.env.EDEN_SANITY_DATASET,
    EDEN_SANITY_API_DEVELOPER_TOKEN: process.env.EDEN_SANITY_API_DEVELOPER_TOKEN,
  };
}

/** Fail fast when a required secret is missing. Use in Route Handlers / server code. */
export function requireEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
