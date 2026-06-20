"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealthQueryOptions } from "@hooks/health/get-options";

/** Client hook — components MUST use this, not raw fetch or apiFetch. */
export function useHealth() {
  return useQuery(getHealthQueryOptions());
}
