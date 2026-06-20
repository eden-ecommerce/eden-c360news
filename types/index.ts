/**
 * Shared application types.
 *
 * Add project-wide types/interfaces here and import them via
 * `import type { ... } from "@/types"`.
 */

/** Generic shape returned by the example `/api/health` route. */
export interface HealthResponse {
  status: "ok";
  timestamp: string;
}

/** Generic envelope you can reuse for paginated API responses. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
