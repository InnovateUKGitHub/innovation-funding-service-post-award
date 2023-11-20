import jsforce from "jsforce";
import path from "path";
import { LoaderManager } from "./LoaderManager";
import { getSalesforceAccessToken } from "./sf/salesforce";
import { baseLogger } from "./helper/logger";

const logger = baseLogger.child({ loc: "main" });

const date = new Date();

const prefix =
  process.argv[2] ??
  `${date.toISOString().substring(0, 16).replace(":", ".")}.`;

const main = async () => {
  logger.info(`Welcome to sirloadalot!`);
  logger.info(`Prefixing all IDs with "${prefix}"`);
  const loaders = new LoaderManager({ prefix });

  loaders.addPayloadFromFile(
    path.join(__dirname, "..", "payload", "basicProject.yaml")
  );

  const conn = new jsforce.Connection(await getSalesforceAccessToken());
  await loaders.load(conn);
};

main();
