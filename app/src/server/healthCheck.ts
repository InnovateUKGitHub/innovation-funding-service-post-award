import { health } from "../server/health";
import { Logger } from "@shared/developmentLogger";
import { configuration } from "./features/common/config";
import newrelic from "newrelic";

const logger = new Logger("New relic health check");

export const healthCheck = async () => {
  const healthQuery = await health(logger);

  newrelic.recordCustomEvent("ACCHealthCheck", {
    env: configuration.newRelic.appName,
    sfConnection: healthQuery.response.salesforce.status,
  });
};
