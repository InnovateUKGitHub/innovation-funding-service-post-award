import { LogLevel } from "@framework/constants";
import { DateTime } from "luxon";
import { configuration } from "./config";

export interface ILogger {
  debug(message: string, ...params: unknown[]): void;
  info(message: string, ...params: unknown[]): void;
  warn(message: string, ...params: unknown[]): void;
  error(message: string, ...params: unknown[]): void;
}

export class Logger implements ILogger {
  private readonly level: LogLevel;
  private readonly identifier: string | undefined;
  private readonly pretty: boolean;

  constructor(identifier?: string, logLevel?: LogLevel, pretty?: boolean) {
    this.identifier = identifier;
    this.level = logLevel || configuration.logLevel;
    this.pretty = pretty !== undefined ? pretty : configuration.prettyLogs;
  }

  debug(message: string, ...params: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...params);
  }

  info(message: string, ...params: unknown[]) {
    this.log(LogLevel.INFO, message, ...params);
  }

  warn(message: string, ...params: unknown[]) {
    this.log(LogLevel.WARN, message, ...params);
  }

  error(message: string, ...params: unknown[]) {
    this.log(LogLevel.ERROR, message, ...params);
  }

  private log(level: LogLevel, message: string, ...params: unknown[]) {
    if (level >= this.level) {
      const item = {
        type: LogLevel[level],
        identifier: this.identifier || "",
        time: DateTime.local().toISO(),
        message,
        params,
      };
      const output = this.pretty ? JSON.stringify(item, null, 2) : JSON.stringify(item);
      console.info(output);
    }
  }
}
