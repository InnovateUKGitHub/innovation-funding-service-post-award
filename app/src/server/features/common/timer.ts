import { ILogger } from "@server/features/common";
import { ITimer } from "@framework/types";

export class Timer implements ITimer {
  private readonly start: Date;

  constructor(private readonly logger: ILogger, private readonly message: string) {
    this.start = new Date();
  }

  public finish() {
    const finished = new Date();
    const args = {
      info: this.message,
      duration: finished.getTime() - this.start.getTime(),
    };
    this.logger.debug(`Finished Timer`, args);
  }
}
