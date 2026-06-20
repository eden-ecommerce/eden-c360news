"use client";

import { isAlgoliaEnvConfigured } from "@lib/env-configured";
import { createInsightsMiddleware } from "instantsearch.js/es/middlewares";
import { useEffect } from "react";
import { useInstantSearch } from "react-instantsearch";
import aa from "search-insights";

/**
 * Generic Algolia Insights middleware. Initialise when credentials are present.
 * Pass `userToken` when you have a stable user identifier from your auth layer.
 */
export function InsightsMiddleware({ userToken }: { userToken?: string }) {
  const { addMiddlewares } = useInstantSearch();

  useEffect(() => {
    if (!isAlgoliaEnvConfigured()) {
      return;
    }

    aa("init", {
      appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
      apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string,
    });

    if (userToken) {
      aa("setUserToken", userToken);
    }

    const middleware = createInsightsMiddleware({
      insightsClient: aa,
    });

    return addMiddlewares(middleware);
  }, [addMiddlewares, userToken]);

  return null;
}
