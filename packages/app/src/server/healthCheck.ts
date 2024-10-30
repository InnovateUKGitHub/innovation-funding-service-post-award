import { health } from "./health";
import { Logger } from "@innovateuk/logger";
import { configuration } from "./features/common/config";

const logger = new Logger("New relic health check");

export const healthCheck = async () => {
  const healthQuery = await health(logger);

  // newrelic is a global variable instantiated as a banner of the webpack/esbuild build
  if (newrelic) {
    newrelic.recordCustomEvent("ACCHealthCheck", {
      env: configuration.newRelic.appName,
      sfConnection: healthQuery.response.salesforce.status,
    });
  }
};
