import "server-only";

const isRunningOnServer = () => typeof window === "undefined";

/**
 * Server fetch against Eden API (`NEXT_PUBLIC_EDEN_API_URL`).
 * Do not use `apiFetch` — that targets this app's own API origin.
 */
export const edenFetch = (
  path: string,
  init?: Parameters<typeof fetch>[1],
): Promise<Response> => {
  const baseUrl = process.env.NEXT_PUBLIC_EDEN_API_URL ?? "";
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const headers = {
    ...(isRunningOnServer() ? { "user-agent": "app-router-vercel" } : {}),
    ...(init?.headers ?? {}),
  };

  return fetch(url, {
    ...(init ?? {}),
    headers,
  });
};
