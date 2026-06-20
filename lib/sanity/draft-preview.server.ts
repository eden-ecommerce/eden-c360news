import "server-only";

import { draftMode } from "next/headers";

const isProduction = (): boolean => process.env.NODE_ENV === "production";

/** Draft previews are disabled in production builds — always serve published content when deployed. */
export function isSanityDraftPreviewAllowed(): boolean {
  return !isProduction();
}

/**
 * True when draft mode cookie is set and the environment allows preview fetches.
 * Use before choosing Sanity perspective or Eden previewMode query params.
 */
export async function isSanityDraftPreviewEnabled(): Promise<boolean> {
  if (!isSanityDraftPreviewAllowed()) {
    return false;
  }

  const { isEnabled } = await draftMode();
  return isEnabled;
}
