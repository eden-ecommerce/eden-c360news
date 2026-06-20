import { redirect } from "next/navigation";
import { NAMESPACE_PATH } from "@lib/config";

/**
 * The app is mounted at the domain root only in local dev — in production the
 * Cloudflare Worker routes by namespace. To keep a single source of truth and
 * avoid creating real content outside the namespace, the root simply redirects
 * into the namespace.
 */
export default function RootPage() {
  redirect(NAMESPACE_PATH);
}
