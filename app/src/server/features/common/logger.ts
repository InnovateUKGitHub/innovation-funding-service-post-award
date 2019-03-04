import { Configuration } from "./config";
import { LogLevel } from "../../../types/logLevel";

export interface ILogger {
  debug(message: string, params: any[]): void;
  info(message: string, params: any[]): void;
  warn(message: string, params: any[]): void;
  error(message: string, params: any[]): void;
}

export class Logger implements ILogger {
  private readonly level: LogLevel;

  constructor(logLevel?: LogLevel) {
    this.level = logLevel || Configuration.logLevel;
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
    // TODO: impliment logging for server logs
    if(level >= this.level) {
      console.log(`${LogLevel[level]}: ${message}`, ...params);
    }
  }
}
