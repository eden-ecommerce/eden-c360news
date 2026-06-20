"use client";

import { useQuery } from "@tanstack/react-query";
import { getAlgoliaSearchQueryOptions } from "@hooks/algolia/get-options";

type Options = {
  query: string;
  indices?: readonly string[];
  enabled?: boolean;
};

/** Client hook for Algolia search outside InstantSearch widget trees. */
export function useAlgoliaSearch(options: Options) {
  return useQuery(getAlgoliaSearchQueryOptions(options));
}
