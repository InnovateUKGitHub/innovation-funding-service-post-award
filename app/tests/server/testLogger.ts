import { ILogger } from "../../src/server/features/common/logger";

export class TestLogger implements ILogger {
  log(message: string, params: any[]): void {
    // do nothing
  }
}
