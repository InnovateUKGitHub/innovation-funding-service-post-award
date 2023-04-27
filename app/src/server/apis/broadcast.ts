import { contextProvider } from "@server/features/common/contextProvider";

import { BroadcastMessage } from "@framework/entities/broadcastMessage";
import { BroadcastDto } from "@framework/dtos/BroadcastDto";

import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetAllBroadcasts } from "@server/features/broadcast/getAll";
import { GetBroadcast } from "@server/features/broadcast/getBroadcast";

class BroadcastApi extends ControllerBase<BroadcastMessage> {
  constructor() {
    super("broadcasts");

    this.getItems("/", () => ({}), this.getAll);
    this.getItem("/:broadcastId", p => ({ broadcastId: p.broadcastId as BroadcastId }), this.get);
  }

  public async getAll(params: ApiParams): Promise<BroadcastDto[]> {
    const query = new GetAllBroadcasts();
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ broadcastId: BroadcastId }>): Promise<BroadcastDto> {
    const query = new GetBroadcast(params.broadcastId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new BroadcastApi();

export type IBroadcastApi = Pick<BroadcastApi, "getAll" | "get">;
