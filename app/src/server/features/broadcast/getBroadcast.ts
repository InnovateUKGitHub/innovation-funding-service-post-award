import { QueryBase } from "@server/features/common";
import { BroadcastDto, IContext } from "@framework/types";

export class GetBroadcast extends QueryBase<BroadcastDto> {
  constructor(private readonly broadcastId: string) {
    super();
  }

  public async run(context: IContext): Promise<BroadcastDto> {
    return await context.repositories.broadcast.get(this.broadcastId);
  }
}
