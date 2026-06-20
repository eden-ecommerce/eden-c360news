import { ErrorCard } from "@components/ui/ErrorCard";

type HealthStatusErrorProps = {
  onRetry: () => void;
};

export function HealthStatusError({ onRetry }: HealthStatusErrorProps) {
  return (
    <ErrorCard
      title="Health check failed"
      message="The API did not respond. Ensure the dev server is running."
      onRetry={onRetry}
    />
  );
}
