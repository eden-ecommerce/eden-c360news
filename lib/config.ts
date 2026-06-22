/**
 * Per-project configuration for the Christian News namespace.
 *
 * This app is deployed at https://eden-c360news.vercel.app/christian-news
 * and mounted under the `/christian-news` namespace.
 */

import { API_BASE_URL, ASSET_BASE_URL } from "@lib/constants";

export { API_BASE_URL, ASSET_BASE_URL };

/** The single URL namespace this app is mounted under (no leading slash). */
export const NAMESPACE = "christian-news";

/** Absolute path prefix for the namespace, e.g. "/churches". */
export const NAMESPACE_PATH = `/${NAMESPACE}`;

/**
 * Build an absolute URL for a static asset in `/public` (metadata, dynamic paths).
 * For images prefer `import x from "@public/file.png"` with `next/image` and `unoptimized`.
 *
 * @example assetUrl("/logo.png") -> "https://assets.example.com/logo.png"
 */
export function assetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${ASSET_BASE_URL}${normalized}`;
}

/**
 * Build a fully-qualified API URL. Use in `fetch-*.ts` when you need the URL
 * string; prefer `apiFetch(path)` which calls this internally.
 *
 * @example apiUrl("/api/health") -> "http://localhost:3000/api/health" (dev)
 */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
