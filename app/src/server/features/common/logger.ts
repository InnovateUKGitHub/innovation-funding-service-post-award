import { Configuration } from "./config";
import { LogLevel } from "@framework/types/logLevel";
import { AppError } from "./appError";
import { DateTime } from "luxon";

export interface ILogger {
  debug(message: string, ...params: any[]): void;
  info(message: string, ...params: any[]): void;
  warn(message: string, ...params: any[]): void;
  error(message: string, ...params: any[]): void;
}

export class Logger implements ILogger {
  private readonly level: LogLevel;
  private readonly identifier: string | undefined;
  private readonly pretty: boolean;

  constructor(identifier?: string, logLevel?: LogLevel, pretty?: boolean) {
    this.identifier = identifier;
    this.level = logLevel || Configuration.logLevel;
    this.pretty = pretty !== undefined ? pretty : Configuration.prettyLogs;
  }

  debug(message: string, ...params: any[]) {
    this.log(LogLevel.DEBUG, message, ...params);
  }

  info(message: string, ...params: any[]) {
    this.log(LogLevel.INFO, message, ...params);
  }

  warn(message: string, ...params: any[]) {
    this.log(LogLevel.WARN, message, ...params);
  }

  error(message: string, ...params: any[]) {
    this.log(LogLevel.ERROR, message, ...params);
  }

  private log(level: LogLevel, message: string, ...params: any[]) {
    if(level >= this.level) {
      const item = {
        type: LogLevel[level],
        identifier: this.identifier || "",
        time: DateTime.local().toISO(),
        message,
        params
      };
      const output = this.pretty ? JSON.stringify(item, null, 2) : JSON.stringify(item);
      console.log(output);
    }
  }
}
