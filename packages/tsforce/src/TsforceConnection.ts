import type { ExecutionRequest } from "@graphql-tools/utils";
import { xml } from "@innovateuk/common/xml";
import { ILogger, Logger, Timer } from "@innovateuk/logger";
import { print } from "graphql";
import { PayloadError } from "relay-runtime";
import { TsforceConnectionDataloader } from "./TsforceDataloader";
import { TsforceHttpClient } from "./TsforceHttpClient";
import { TsforceSobject } from "./TsforceSobject";
import { ITsforceConnection } from "./types/ITsforceConnection";
import { ITsforceHttpClient } from "./types/ITsforceHttpClient";
import { ITsforceSobject } from "./types/ITsforceObject";

interface ExecuteConfiguration {
  decodeHTMLEntities?: boolean;
}

/**
 * User-specific connection to the Salesforce API.
 * Initialise by creating a connection with the `asUser` static method.
 */
class TsforceConnection implements ITsforceConnection {
  private readonly version: string;
  private readonly logger: ILogger;
  private readonly accessToken: string;
  private readonly sobjectMap: Map<string, ITsforceSobject> = new Map();
  public readonly email: string;
  public readonly httpClient: ITsforceHttpClient;
  public readonly dataLoader: TsforceConnectionDataloader;

  constructor({
    version = "60.0",
    instanceUrl,
    accessToken,
    email,
    traceId,
    httpClient,
  }: {
    version?: string;
    instanceUrl: string;
    accessToken: string;
    email: string;
    traceId: string;
    httpClient?: ITsforceHttpClient;
  }) {
    this.dataLoader = new TsforceConnectionDataloader({ connection: this, email, traceId, version });
    this.httpClient = httpClient || new TsforceHttpClient({ accessToken, instanceUrl });
    this.version = version;
    this.email = email;
    this.logger = new Logger("tsforce", { prefixLines: [{ email, traceId }] });
    this.accessToken = accessToken;
  }

  private startTimer(message: string) {
    return new Timer(this.logger, message);
  }

  /**
   * Execute a GraphQL Query AST via the Salesforce GraphQL API.
   *
   * @todo Remove decodeHTMLEntities when Salesforce no longer returns encoded results.
   * @returns GraphQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  public async executeGraphQL<T>({
    document,
    variables,
    decodeHTMLEntities,
  }: ExecutionRequest & ExecuteConfiguration): Promise<{ data: T; errors: PayloadError[] }> {
    const query = print(document);
    const queryName = /query (\w+)[\s(]/.exec(query)?.[1];

    const timer = this.startTimer(queryName ?? "Anonymous GraphQL Query");

    // "graphql" is not part of the template string because our ESbuild/Relay GraphQL hack
    // does thinks our code is actually a query.
    const data = await this.httpClient.fetchJson(`/services/data/v${this.version}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      decodeHTMLEntities,
    });

    if (
      typeof data === "object" &&
      data !== null &&
      "errors" in data &&
      Array.isArray(data?.errors) &&
      data.errors.length > 0
    ) {
      this.logger.error("GraphQL Error", queryName, variables, data);
    } else {
      this.logger.trace("GraphQL Result", queryName, variables, data);
    }

    timer.finish();

    return data as { data: T; errors: PayloadError[] };
  }

  /**
   * Execute a SOQL Query via the Salesforce SOQL Query API.
   *
   * @returns SOQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  public async executeSOQL<T>({
    query,
  }: {
    query: string;
  }): Promise<{ totalSize: number; done: boolean; records: T[] }> {
    const timer = this.startTimer(query);
    const data = this.httpClient.fetchJson(`/services/data/v${this.version}/query`, {
      method: "GET",
      searchParams: {
        q: query,
      },
    });
    this.logger.trace("SOQL Query Return", query, await data);
    timer.finish();
    return data as Promise<{ totalSize: number; done: boolean; records: T[] }>;
  }

  public async executeApex({ query }: { query: string }): Promise<string> {
    return this.httpClient.fetchText(`/services/Soap/T/${this.version}`, {
      method: "POST",
      headers: {
        Accept: "text/xml",
        "Content-Type": "text/xml",
        SOAPAction: "blargh", // any string is ok here
      },
      body: xml`
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tns="urn:tooling.soap.sforce.com"
>
  <soap:Header>
    <tns:DebuggingHeader>
      <tns:categories>
        <tns:category>apex_code</tns:category>
        <tns:level>FINEST</tns:level>
      </tns:categories>
      <tns:debugLevel>DETAIL</tns:debugLevel>
    </tns:DebuggingHeader>
    <tns:SessionHeader>
      <tns:sessionId>${this.accessToken}</tns:sessionId>
    </tns:SessionHeader>
  </soap:Header>
  <soap:Body>
    <tns:executeAnonymous>
      <tns:String>${query}</tns:String>
    </tns:executeAnonymous>
  </soap:Body>
</soap:Envelope>
      `,
    });
  }

  public sobject(name: string): ITsforceSobject {
    if (this.sobjectMap.has(name)) {
      return this.sobjectMap.get(name) as ITsforceSobject;
    } else {
      const newSobject = new TsforceSobject({ connection: this, name });
      this.sobjectMap.set(name, newSobject);
      return newSobject;
    }
  }
}

export { TsforceConnection };
