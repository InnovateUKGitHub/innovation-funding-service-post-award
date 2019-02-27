import { ILogger } from "../../src/server/features/common/logger";

export class TestLogger implements ILogger {
  info(message: string, params: any[]): void {
    // do nothing
  }
  debug(message: string, params: any[]): void {
    // do nothing
  }
  warn(message: string, params: any[]): void {
    // do nothing
  }
  error(message: string, params: any[]): void {
    // do nothing
  }
}
