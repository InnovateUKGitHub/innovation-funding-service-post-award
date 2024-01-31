import { gzip } from "node-gzip";
import { health } from "../server/health";
import { Logger } from "@shared/developmentLogger";
import { configuration } from "./features/common/config";

export const healthCheck = async () => {
  const logger = new Logger("New relic health check");
  const healthQuery = await health(logger);

  const newRelicEventData = {
    eventType: "ACCHealthCheck",
    env: configuration.newRelic.appName,
    sfConnection: healthQuery.response.salesforce,
  };

  const compressedData = await gzip(JSON.stringify(newRelicEventData));
  const postBody = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Insert-Key": configuration.newRelic.apiKey,
      "Content-Encoding": "gzip",
    },
    body: compressedData,
  };

  await fetch(configuration.newRelic.eventsUrl, postBody);
};
