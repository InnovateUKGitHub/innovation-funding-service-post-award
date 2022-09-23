import { ILogger, Logger } from "@shared/developmentLogger";

export class TestLogger implements ILogger {
  private readonly innerLogger = new Logger("TestLogger");
  public outputToConsole = false;

  info(message: string, params: unknown[]): void {
    if (this.outputToConsole) {
      this.innerLogger.info(message, params);
    }
  }

  debug(message: string, params: unknown[]): void {
    if (this.outputToConsole) {
      this.innerLogger.debug(message, params);
    }
  }

  warn(message: string, params: unknown[]): void {
    if (this.outputToConsole) {
      this.innerLogger.warn(message, params);
    }
  }

  error(message: string, params: unknown[]): void {
    if (this.outputToConsole) {
      this.innerLogger.error(message, params);
    }
  }
}
