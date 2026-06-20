import "server-only";

import { isEdenOAuthEnvConfigured } from "@lib/env-configured";
import { edenFetch } from "@lib/eden/fetch";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const CACHE_REVALIDATE_SECONDS = 3000;
const TOKEN_REFRESH_BUFFER_MS = 300000;

type GetAuthParams = {
  grantType: string;
  scope: string;
};

type GetAuthResponse = {
  token_type: string;
  access_token: string;
  expires_in: number;
  expires_at: number;
};

const getAuthFromEden = async ({
  grantType,
  scope,
}: GetAuthParams): Promise<GetAuthResponse | undefined> => {
  if (!isEdenOAuthEnvConfigured()) {
    return undefined;
  }

  const auth = await edenFetch(`${process.env.NEXT_PUBLIC_EDEN_OAUTH_URL}/access_token`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.EDEN_PAYMENT_CLIENT_ID,
      client_secret: process.env.EDEN_PAYMENT_CLIENT_SECRET,
      grant_type: grantType,
      scope,
    }),
  });

  if (!auth.ok) {
    return undefined;
  }

  const data = (await auth.json()) as Omit<GetAuthResponse, "expires_at">;
  const expiresAt = Date.now() + data.expires_in * 1000;

  return {
    ...data,
    expires_at: expiresAt,
  };
};

const isTokenStale = (expiresAt: number): boolean =>
  expiresAt - Date.now() <= TOKEN_REFRESH_BUFFER_MS;

const getOAuthCacheTag = (params: GetAuthParams): string =>
  `eden-oauth-token-${params.grantType}-${params.scope}`;

const getCachedAuthEntry = (params: GetAuthParams) =>
  unstable_cache(
    async (): Promise<GetAuthResponse | undefined> => getAuthFromEden(params),
    ["eden-oauth-token", params.grantType, params.scope],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ["all", getOAuthCacheTag(params)],
    },
  );

const getCachedAccessToken = async (params: GetAuthParams): Promise<string | undefined> => {
  const cached = await getCachedAuthEntry(params)();

  if (cached && !isTokenStale(cached.expires_at)) {
    return cached.access_token;
  }

  const newAuth = await getAuthFromEden(params);

  if (!newAuth) {
    return undefined;
  }

  return newAuth.access_token;
};

/** Bearer token header for Eden API Sanity routes. Minimum scope: `sanity:read`. */
export const getOauthTokenHeader = cache(async () => {
  const accessToken = await getCachedAccessToken({
    grantType: "client_credentials",
    scope: "sanity:read",
  });

  if (!accessToken) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
});
