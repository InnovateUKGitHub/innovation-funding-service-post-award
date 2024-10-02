import DataLoader from "dataloader";
import { TsforceConnection } from "./TsforceConnection";
import { BaseTsforceSubrequest } from "./requests/BaseTsforceSubrequest";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";

interface TsforceCompositeSubrequestResult<T> {
  body: T;
  httpHeaders: Record<string, string>;
  httpStatusCode: number;
  referenceId: string;
}

interface TsforceCompositeResponseBody {
  compositeResponse: TsforceCompositeSubrequestResult<unknown>[];
}

class TsforceConnectionDataloader {
  private readonly connection: TsforceConnection;
  private readonly logger: ILogger;
  subrequest: DataLoader<BaseTsforceSubrequest<unknown>, TsforceCompositeSubrequestResult<unknown>>;

  private async executeCompositeQuery(
    subrequests: ReadonlyArray<BaseTsforceSubrequest<unknown>>,
  ): Promise<TsforceCompositeSubrequestResult<unknown>[]> {
    const compositeRequest = subrequests.map((x, i) => x.compose(i));

    this.logger.debug(
      "Composite Request",
      compositeRequest.map(({ method, url }) => ({ method, url })),
    );

    const data = (await this.connection.httpClient.fetchJson("/composite", {
      method: "POST",
      body: JSON.stringify({
        allOrNone: false,
        // collateSubrequests: true,
        compositeRequest,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })) as TsforceCompositeResponseBody;

    // Re-sort responses back into order
    return subrequests.map((_, i) =>
      data.compositeResponse.find(y => y.referenceId === String(i)),
    ) as TsforceCompositeSubrequestResult<unknown>[];
  }

  constructor({ connection, email, traceId }: { connection: TsforceConnection; email: string; traceId: string }) {
    this.connection = connection;
    this.subrequest = new DataLoader<BaseTsforceSubrequest<unknown>, TsforceCompositeSubrequestResult<unknown>>(
      keys => this.executeCompositeQuery(keys),
      {
        maxBatchSize: 5,
      },
    );
    this.logger = new Logger("tsforce", { prefixLines: [{ email, traceId }] });
  }
}

export { TsforceConnectionDataloader, TsforceCompositeSubrequestResult };
