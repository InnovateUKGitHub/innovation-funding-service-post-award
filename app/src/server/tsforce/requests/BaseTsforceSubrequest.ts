import { TsforceCompositeSubrequestResult } from "../TsforceDataloader";
import { BaseTsforceRequest, BaseTsforceRequestProps } from "./BaseTsforceRequest";

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
  abstract method: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  abstract payload(): TsforceSubrequestPayload;

  compose(n: number): BaseTsforceCompositeSubrequest {
    const { body, queryParameters, url } = this.payload();

    let fullUrl = `/services/data/${this.version}${url}`;

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
    const result = (await this.connection.dataLoader.subrequest.load(this)) as TsforceCompositeSubrequestResult<T>;

    if (result.httpStatusCode < 200 || result.httpStatusCode >= 300) {
      throw new Error("error :c");
    }

    return result.body;
  }
}

abstract class BaseTsforceSobjectSubrequest<T> extends BaseTsforceSubrequest<T> {
  protected readonly sobject: string;

  constructor({ sobject, connection }: { sobject: string } & BaseTsforceRequestProps) {
    super({ connection });
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
