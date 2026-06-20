import { algoliasearch, type SearchClient } from "algoliasearch";
import { isAlgoliaEnvConfigured } from "@lib/env-configured";

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "";

export const ALGOLIA_INDEXES = {
  products: "products",
  organisationHub: "organisationHub",
} as const;

export type AlgoliaIndexKey = keyof typeof ALGOLIA_INDEXES;
export type AlgoliaIndexName = (typeof ALGOLIA_INDEXES)[AlgoliaIndexKey];

let cachedSearchClient: SearchClient | null = null;

const createSearchClient = (): SearchClient | null => {
  if (!isAlgoliaEnvConfigured()) {
    return null;
  }

  return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
};

/** Singleton Algolia search client (search-only key). Returns null when not configured. */
export const getAlgoliaSearchClient = (): SearchClient | null => {
  if (!cachedSearchClient) {
    cachedSearchClient = createSearchClient();
  }

  return cachedSearchClient;
};

/** @deprecated Use isAlgoliaEnvConfigured from @lib/env-configured */
export const hasAlgoliaCredentials = isAlgoliaEnvConfigured;
