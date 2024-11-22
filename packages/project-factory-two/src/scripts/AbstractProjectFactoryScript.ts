import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";

abstract class AbstractProjectFactoryScript<Context> {
  private connection: ITsforceConnection;

  constructor({ connection }: { connection: ITsforceConnection }) {
    this.connection = connection;
  }

  run() {
    return this.script({
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
  }): Promise<Context>;
}

export { AbstractProjectFactoryScript };
