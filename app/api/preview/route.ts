import { getServerEnv } from "@lib/env-server";
import { NAMESPACE_PATH } from "@lib/config";
import { isSanityDraftPreviewAllowed } from "@lib/sanity/draft-preview.server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const PREVIEW_TYPE_PATHS: Record<string, (slug: string | null) => string | null> = {
  home: () => NAMESPACE_PATH,
  page: (slug) => (slug ? `${NAMESPACE_PATH}/${slug}` : null),
};

export const GET = async (request: Request) => {
  if (!isSanityDraftPreviewAllowed()) {
    redirect(NAMESPACE_PATH);
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const env = getServerEnv();

  if (!token || token !== env.SANITY_PREVIEW_TOKEN) {
    redirect(NAMESPACE_PATH);
  }

  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  if (!type) {
    redirect(NAMESPACE_PATH);
  }

  const resolvePath = PREVIEW_TYPE_PATHS[type];
  const url = resolvePath ? resolvePath(slug) : null;

  if (!url) {
    redirect(NAMESPACE_PATH);
  }

  const draft = await draftMode();
  draft.enable();

  redirect(url);
};
