import { TsforceCompositeSubrequestResult } from "../TsforceDataloader";
import { BaseTsforceRequest, BaseTsforceRequestProps } from "./BaseTsforceRequest";
import { AnyObject } from "../types/AnyObject";

interface BaseTsforceCompositeSubrequest {
  body?: AnyObject;
  method: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  referenceId: string;
  url: string;
}

interface TsforceSubrequestPayload {
  body: AnyObject | undefined;
  queryParameters: Record<string, string> | undefined;
  url: string;
}

abstract class BaseTsforceSubrequest<T> extends BaseTsforceRequest<T> {
  private readonly useSubrequests?: boolean;
  abstract method: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  abstract payload(): TsforceSubrequestPayload;

  constructor({ connection, useSubrequests }: BaseTsforceRequestProps & { useSubrequests?: boolean }) {
    super({ connection });
    this.useSubrequests = useSubrequests;
  }

  compose(n: number): BaseTsforceCompositeSubrequest {
    const { body, queryParameters, url } = this.payload();

    let fullUrl = url;

    if (queryParameters) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParameters)) {
        searchParams.set(key, value);
      }
      fullUrl += `?${searchParams}`;
    }

    return {
      ...(body ? { body } : {}),
      method: this.method,
      url: fullUrl,
      referenceId: String(n),
    };
  }

  async execute(): Promise<T> {
    if (this.useSubrequests) {
      const result = (await this.connection.dataLoader.subrequest.load(this)) as TsforceCompositeSubrequestResult<T>;

      if (result.httpStatusCode < 200 || result.httpStatusCode >= 300) {
        throw new Error(JSON.stringify(result));
      }

      return result.body;
    } else {
      const req = this.compose(1);

      return this.connection.httpClient.fetchJson(req.url, {
        method: req.method,
        body: req.body ? JSON.stringify(req.body) : undefined,
      });
    }
  }
}

abstract class BaseTsforceSobjectSubrequest<T> extends BaseTsforceSubrequest<T> {
  protected readonly sobject: string;

  constructor({
    sobject,
    connection,
    useSubrequests,
  }: { sobject: string; useSubrequests?: boolean } & BaseTsforceRequestProps) {
    super({ connection, useSubrequests });
    this.sobject = sobject;
  }
}

abstract class BaseTsforceSobjectIdSubrequest<T> extends BaseTsforceSobjectSubrequest<T> {
  protected readonly id: string;

  constructor({ sobject, id, connection }: { sobject: string; id: string } & BaseTsforceRequestProps) {
    super({ sobject, connection });
    this.id = id;
  }
}

export {
  BaseTsforceSubrequest,
  BaseTsforceSobjectSubrequest,
  BaseTsforceSobjectIdSubrequest,
  TsforceSubrequestPayload,
};
