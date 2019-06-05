import { gzip } from "node-gzip";
import { health } from "../server/health";
import { Logger } from "./features/common";

export const healthCheck = async () => {
  const logger = new Logger("New relic health check");
  const sfConnection = await health(logger).then(res => res.response.salesforce);

  const newRelicEventData = {
    eventType:"ACCHealthCheck",
    env:`${process.env.NEW_RELIC_APP_NAME}`,
    sfConnection:`${sfConnection}`
  };

  const compressedData = await gzip(JSON.stringify(newRelicEventData));
  const postBody = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Insert-Key": `${process.env.NEW_RELIC_API_KEY}`,
      "Content-Encoding": "gzip"
    },
    body: compressedData
  };

  await fetch(`${process.env.NEW_RELIC_EVENTS_URL}`, postBody);
};
