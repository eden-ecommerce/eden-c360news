"use client";

import { HealthStatusError } from "@components/health/HealthStatusError";
import { HealthStatusSkeleton } from "@components/health/HealthStatusSkeleton";
import { HealthStatusView } from "@components/health/HealthStatusView";
import { useHealth } from "@hooks/health/use-health";

export function HealthStatusContainer() {
  const { data, isPending, isError, refetch } = useHealth();

  if (isPending) return <HealthStatusSkeleton />;
  if (isError) return <HealthStatusError onRetry={() => void refetch()} />;
  if (!data) return <p className="text-sm text-muted-foreground">No health data.</p>;

  return <HealthStatusView data={data} />;
}
