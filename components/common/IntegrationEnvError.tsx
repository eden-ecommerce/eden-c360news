import { ErrorCard } from "@components/ui/ErrorCard";
import {
  ENV_NOT_CONFIGURED_MESSAGE,
  INTEGRATION_ENV_VARS,
  INTEGRATION_LABELS,
  type IntegrationKey,
} from "@lib/env-configured";

type IntegrationEnvErrorProps = {
  integration: IntegrationKey;
  className?: string;
};

/** Use when integration env vars are missing — explains why content is not showing. */
export function IntegrationEnvError({ integration, className }: IntegrationEnvErrorProps) {
  return (
    <ErrorCard
      title={`${INTEGRATION_LABELS[integration]} not configured`}
      message={ENV_NOT_CONFIGURED_MESSAGE}
      envVars={INTEGRATION_ENV_VARS[integration]}
      className={className}
    />
  );
}
