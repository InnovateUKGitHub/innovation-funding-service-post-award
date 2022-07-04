import { LogLevel } from "@framework/constants";
import { DateTime } from "luxon";

/**
 * Client version of dev-logger that is overwritten by webpack for the client side
 * This one has no hooks into server-side dependencies
 */
interface ILogger {
  debug(message: string, ...params: any[]): void;
  info(message: string, ...params: any[]): void;
  warn(message: string, ...params: any[]): void;
  error(message: string, ...params: any[]): void;
}

class Logger implements ILogger {
  private readonly level: LogLevel;
  private readonly identifier: string | undefined;
  private readonly pretty: boolean;

  constructor(identifier?: string, logLevel?: LogLevel, pretty?: boolean) {
    this.identifier = identifier;
    this.level = logLevel || LogLevel.ERROR;
    this.pretty = pretty !== undefined ? pretty : false;
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
    if (level >= this.level) {
      const item = {
        type: LogLevel[level],
        identifier: this.identifier || "",
        time: DateTime.local().toISO(),
        message,
        params,
      };
      const output = this.pretty ? JSON.stringify(item, null, 2) : JSON.stringify(item);
      console.log(output);
    }
  }
}

export function devLogger(warning: string): void {
  const isProdUrl = !/localhost|acc-dev/.test(window.location.hostname);

  if (isProdUrl) return;

  return new Logger("Develop Warning").warn(warning);
}
