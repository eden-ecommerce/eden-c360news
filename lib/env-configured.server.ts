import "server-only";

import { getServerEnv } from "@lib/env-server";

export function isSanityEnvConfigured(): boolean {
  const env = getServerEnv();
  return Boolean(
    env.EDEN_SANITY_PROJECT_ID &&
      env.EDEN_SANITY_DATASET &&
      env.EDEN_SANITY_API_DEVELOPER_TOKEN,
  );
}
