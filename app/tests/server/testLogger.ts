import { ILogger, Logger } from "../../src/server/features/common/logger";
import { LogLevel } from "@framework/types/logLevel";

export class TestLogger implements ILogger {
  private readonly innerLogger = new Logger(undefined, LogLevel.DEBUG, true);
  public outputToConsole = false;

  info(message: string, params: any[]): void {
    if (this.outputToConsole) {
      this.innerLogger.info(message, params);
    }
  }

  debug(message: string, params: any[]): void {
    if (this.outputToConsole) {
      this.innerLogger.debug(message, params);
    }
  }

  warn(message: string, params: any[]): void {
    if (this.outputToConsole) {
      this.innerLogger.warn(message, params);
    }
  }

  error(message: string, params: any[]): void {
    if (this.outputToConsole) {
      this.innerLogger.error(message, params);
    }
  }
}
