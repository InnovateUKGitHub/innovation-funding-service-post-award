import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { configuration } from "@server/features/common/config";
import { Timer } from "@server/features/common/timer";
import { getCachedSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { print } from "graphql";
import { PayloadError } from "relay-runtime";
import { TsforceHttpClient } from "./TsforceHttpClient";
import { TsforceSobject } from "./TsforceSobject";
import { TsforceConnectionDataloader } from "./TsforceDataloader";

interface ExecuteConfiguration {
  decodeHTMLEntities?: boolean;
}

/**
 * User-specific connection to the Salesforce API.
 * Initialise by creating a connection `asUser` or `asSystemUser`.
 */
class TsforceConnection {
  private readonly version: string;
  private readonly logger: ILogger;
  public readonly email: string;
  public readonly httpClient: TsforceHttpClient;
  public readonly dataLoader: TsforceConnectionDataloader;
  private readonly sobjectMap: Map<string, TsforceSobject> = new Map();

  constructor({
    version = "v59.0",
    instanceUrl,
    accessToken,
    email,
    tid,
  }: {
    version?: string;
    instanceUrl: string;
    accessToken: string;
    email: string;
    tid: string;
  }) {
    this.dataLoader = new TsforceConnectionDataloader({ connection: this, email, tid });
    this.httpClient = new TsforceHttpClient({ version, accessToken, instanceUrl, email, tid });
    this.version = version;
    this.email = email;
    this.logger = new Logger("tsforce", { prefixLines: [{ email, tid }] });
  }

  private startTimer(message: string) {
    return new Timer(this.logger, message);
  }

  /**
   * Connect to Salesforce with a username
   *
   * @param email The username/email address of the user.
   * @returns A user-specific connection to the Salesforce API.
   */
  public static async asUser(email: string, tid: string) {
    const { accessToken, url } = await getCachedSalesforceAccessToken({
      clientId: configuration.salesforceServiceUser.clientId,
      connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      currentUsername: email,
    });

    return new TsforceConnection({
      accessToken,
      instanceUrl: url,
      email,
      tid,
    });
  }

  /**
   * Connect to Salesforce as the Salesforce System user
   *
   * @returns A connection to the Salesforce API as a system user.
   */
  public static asSystemUser(tid: string) {
    return TsforceConnection.asUser(configuration.salesforceServiceUser.serviceUsername, tid);
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
    const data = await this.httpClient.fetchJson("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      decodeHTMLEntities,
    });

    if (data.errors.length) {
      this.logger.error("GraphQL Error", queryName, variables, data);
    } else {
      this.logger.trace("GraphQL Result", queryName, variables, data);
    }

    timer.finish();

    return data;
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
    const data = this.httpClient.fetchJson("/query", {
      method: "GET",
      searchParams: {
        q: query,
      },
    });
    this.logger.trace("SOQL Query Return", query, await data);
    timer.finish();
    return data;
  }

  public sobject(name: string): TsforceSobject {
    if (this.sobjectMap.has(name)) {
      return this.sobjectMap.get(name) as TsforceSobject;
    } else {
      const newSobject = new TsforceSobject({ connection: this, name });
      this.sobjectMap.set(name, newSobject);
      return newSobject;
    }
  }
}

export { TsforceConnection };
