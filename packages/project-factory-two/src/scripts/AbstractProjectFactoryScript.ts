import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { DatabaseConnector } from "../database/DatabaseConnector";

abstract class AbstractProjectFactoryScript<Context, Arguments> {
  private connection: ITsforceConnection;
  protected readonly now: Date;

  private readonly timestamp: string;
  private readonly discriminator: string;

  constructor({ connection }: { connection: ITsforceConnection }) {
    this.connection = connection;
    this.now = new Date();

    // Use the BASE-36 of the last 5 chars of the timestamp
    this.timestamp = Math.floor(this.now.getTime()).toString(36).slice(-5);

    // Create a 5-digit BASE-36 random number
    this.discriminator = Math.floor(Math.random() * 36 ** 5)
      .toString(36)
      .padStart(2, "0");
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

  prefix(text: string) {
    return `${this.timestamp}${this.discriminator}.${text}`;
  }
}

export { AbstractProjectFactoryScript };
