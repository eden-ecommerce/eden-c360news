import { queryOptions } from "@tanstack/react-query";
import { fetchHealth } from "@hooks/health/fetch-health";
import { healthKeys } from "@hooks/health/get-key";

export function getHealthQueryOptions() {
  return queryOptions({
    queryKey: healthKeys.status(),
    queryFn: fetchHealth,
  });
}
