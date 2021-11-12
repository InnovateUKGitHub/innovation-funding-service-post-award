export interface HealthCheckResult {
  id: string;
  status: "Success" | "Failed";
  error?: unknown;
}
