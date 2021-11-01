import { QueryBase } from "@server/features/common";
import { BroadcastDto, IContext } from "@framework/types";

export class GetAllBroadcasts extends QueryBase<BroadcastDto[]> {
  public async run(context: IContext): Promise<BroadcastDto[]> {
    return await context.repositories.broadcast.getAll();
  }
}
