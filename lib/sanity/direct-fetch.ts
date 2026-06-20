import "server-only";

import { captureException } from "@sentry/nextjs";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { isSanityDraftPreviewEnabled } from "@lib/sanity/draft-preview.server";
import { err, ok, type Result } from "neverthrow";
import { getServerEnv } from "@lib/env-server";

/** Prod revalidate 3600s — dev 1s. Keep next.tags when editing; extend per document type. */
const cacheTime = process.env.NODE_ENV === "production" ? 3600 : 1;

export { isSanityEnvConfigured } from "@lib/env-configured.server";

/**
 * Run GROQ against the Sanity HTTP API using server credentials.
 * Callers Zod-parse the returned JSON in lib/sanity/get-*.ts.
 */
export const fetchSanityDirect = async <TParams extends Record<string, string>>(
  query: string,
  params?: TParams,
  tags: string[] = [],
): Promise<Result<unknown, string>> => {
  if (!isSanityEnvConfigured()) {
    return err("Sanity environment not configured");
  }

  const env = getServerEnv();
  const projectId = env.EDEN_SANITY_PROJECT_ID as string;
  const dataset = env.EDEN_SANITY_DATASET as string;
  const token = env.EDEN_SANITY_API_DEVELOPER_TOKEN as string;

  const isDraftPreview = await isSanityDraftPreviewEnabled();
  const perspective = isDraftPreview ? "previewDrafts" : "published";
  const revalidate = isDraftPreview ? 1 : cacheTime;
  const url = `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}?perspective=${perspective}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, params }),
      next: {
        tags: ["all", "sanity", ...tags],
        revalidate,
      },
    });

    if (!response.ok) {
      return err(`Error fetching Sanity data: ${response.statusText}`);
    }

    const json = (await response.json()) as { result?: unknown };
    return ok(json.result ?? null);
  } catch (error) {
    captureException(error);
    const message = error instanceof Error ? error.message : String(error);
    return err(message);
  }
};
