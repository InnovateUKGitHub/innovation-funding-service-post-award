import { Configuration } from "./config";

export interface ILogger {
  info(message: string, params: any[]): void;
  debug(message: string, params: any[]): void;
  warn(message: string, params: any[]): void;
  error(message: string, params: any[]): void;
}

enum LogLevel {
  VERBOSE = 1,
  DEBUG,
  INFO,
  WARN,
  ERROR
}

export class Logger implements ILogger {
  private readonly level: LogLevel;

  constructor(logLevel?: LogLevel) {
    this.level = logLevel || this.parseLogLevel(Configuration.logLevel);
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

  private parseLogLevel(level: string) {
    switch(level) {
      case "VERBOSE": return LogLevel.VERBOSE;
      case "DEBUG":   return LogLevel.DEBUG;
      case "INFO":    return LogLevel.INFO;
      case "WARN":    return LogLevel.WARN;
      case "ERROR":
      default:        return LogLevel.ERROR;
    }
  }
}
