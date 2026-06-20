/**
 * React Query key factory for `/api/health`.
 * Hierarchical keys — invalidate with `queryKey: healthKeys.all` or narrower scopes.
 */
export const healthKeys = {
  all: ["health"] as const,
  status: () => [...healthKeys.all, "status"] as const,
};
