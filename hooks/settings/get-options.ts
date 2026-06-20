import { queryOptions } from "@tanstack/react-query";
import { fetchSettings } from "@hooks/settings/fetch-settings";
import { settingsKeys } from "@hooks/settings/get-key";

export function getSettingsQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.detail(),
    queryFn: fetchSettings,
  });
}
