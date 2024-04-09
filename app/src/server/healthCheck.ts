import { health } from "../server/health";
import { Logger } from "@shared/developmentLogger";
import { configuration } from "./features/common/config";
import type NewRelic from "newrelic";

const logger = new Logger("New relic health check");

let newrelic: typeof NewRelic | null = null;
export const healthCheck = async () => {
  if (newrelic === null) {
    newrelic = (await import("newrelic")).default;
  }

  const healthQuery = await health(logger);

  newrelic.recordCustomEvent("ACCHealthCheck", {
    env: configuration.newRelic.appName,
    sfConnection: healthQuery.response.salesforce.status,
  });
};
