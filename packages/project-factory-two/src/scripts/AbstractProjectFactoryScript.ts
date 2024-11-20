import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";

abstract class AbstractProjectFactoryScript {
  private connection: ITsforceConnection;

  constructor({ connection }: { connection: ITsforceConnection }) {
    this.connection = connection;
  }

  run() {
    this.script({
      connection: this.connection,
      Database: new DatabaseConnector({ connection: this.connection }),
    });
  }

  abstract script({
    connection,
    Database,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
  }): Promise<void>;
}

export { AbstractProjectFactoryScript };

// (async () => {
//   const { accessToken, url } = await getSalesforceAccessToken({
//     clientId: strEnv("SALESFORCE_CLIENT_ID"),
//     connectionUrl: strEnv("SALESFORCE_CONNECTION_URL"),
//     currentUsername: strEnv("SALESFORCE_USERNAME"),
//     privateKey: certEnv("SALESFORCE_PRIVATE_KEY"),
//   });

//   const api = new TsforceConnection({
//     accessToken,
//     instanceUrl: url,
//     email: strEnv("SALESFORCE_USERNAME"),
//     traceId: "init",
//   });

//   const Database = new DatabaseConnector({ connection: api });
// })();
