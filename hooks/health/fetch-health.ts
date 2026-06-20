import { apiFetch } from "@lib/apiFetch";
import type { HealthResponse } from "@/types";

/** Server-safe fetch method — used by React Query `queryFn`. */
export function fetchHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/api/health");
}
