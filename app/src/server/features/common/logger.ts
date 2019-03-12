import Util from "util";
import { Configuration } from "./config";
import { IUser } from "../../../types";
import { LogLevel } from "../../../types/logLevel";

export interface ILogger {
  debug(message: string, params: any[]): void;
  info(message: string, params: any[]): void;
  warn(message: string, params: any[]): void;
  error(message: string, params: any[]): void;
}

export class Logger implements ILogger {
  private readonly level: LogLevel;
  private readonly user: IUser | undefined;

  constructor(user?: IUser, logLevel?: LogLevel) {
    this.user = user;
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
    if(level >= this.level) {
      console.log(JSON.stringify({
        timestamp: (new Date()).toISOString(),
        type: LogLevel[level],
        email: !!this.user ? this.user.email : "",
        message,
        params
      }, null, 2));
    }
  }
}
