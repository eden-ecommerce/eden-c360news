import "server-only";

import { captureException } from "@sentry/nextjs";
import { isEdenApiEnvConfigured, isEdenOAuthEnvConfigured } from "@lib/env-configured";
import { edenFetch } from "@lib/eden/fetch";
import { getOauthTokenHeader } from "@lib/eden/get-oauth-token";
import { isSanityDraftPreviewEnabled } from "@lib/sanity/draft-preview.server";
import { err, ok, type Result } from "neverthrow";

/** Prod revalidate 3600s — dev 1s. Keep next.tags when editing; extend per document type. */
const cacheTime = process.env.NODE_ENV === "production" ? 3600 : 1;

/**
 * Legacy Eden API Sanity fetch. Prefer fetchSanityDirect for new work.
 * Appends `?previewMode=true` when draft mode is on.
 */
export const fetchSanity = async (
  path: string,
  tags: string[],
): Promise<Result<unknown, string>> => {
  if (!isEdenApiEnvConfigured()) {
    return err("Eden API environment not configured");
  }

  if (!isEdenOAuthEnvConfigured()) {
    return err("Eden OAuth environment not configured");
  }

  const isDraftPreview = await isSanityDraftPreviewEnabled();
  const previewSuffix = isDraftPreview ? "?previewMode=true" : "";
  const url = `/sanity/v2/eden/${path}${previewSuffix}`;

  try {
    const authHeader = await getOauthTokenHeader();
    if (!authHeader) {
      return err("Failed to obtain Eden OAuth token");
    }

    const response = await edenFetch(url, {
      next: {
        tags: ["all", "sanity", ...tags],
        revalidate: isDraftPreview ? 1 : cacheTime,
      },
      headers: {
        ...authHeader,
      },
    });

    if (!response.ok) {
      return err(`Error fetching Sanity data: ${response.statusText}`);
    }

    return ok(await response.json());
  } catch (error) {
    captureException(error);
    const message = error instanceof Error ? error.message : String(error);
    return err(message);
  }
};
