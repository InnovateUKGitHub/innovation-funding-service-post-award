import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";

abstract class AbstractProjectFactoryScript<Context, Arguments> {
  private connection: ITsforceConnection;

  constructor({ connection }: { connection: ITsforceConnection }) {
    this.connection = connection;
  }

  run(args: Arguments) {
    return this.script({
      connection: this.connection,
      Database: new DatabaseConnector({ connection: this.connection }),
      args,
    });
  }

  abstract script({
    connection,
    Database,
    args,
  }: {
    connection: ITsforceConnection;
    Database: DatabaseConnector;
    args: Arguments;
  }): Promise<Context>;
}

export { AbstractProjectFactoryScript };
