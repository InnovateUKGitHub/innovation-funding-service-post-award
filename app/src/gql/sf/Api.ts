import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { configuration } from "@server/features/common/config";
import { Timer } from "@server/features/common/timer";
import { getCachedSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { mapStringInObject } from "@shared/mapStringInObject";
import { print } from "graphql";
import { decode as decodeHTMLEntities } from "html-entities";
import fetch from "isomorphic-fetch";
import { PayloadError } from "relay-runtime";

interface FetcherConfiguration extends RequestInit {
  searchParams?: Record<string, string>;
  decodeHTMLEntities?: boolean;
}

interface ExecuteConfiguration {
  decodeHTMLEntities?: boolean;
}

/**
 * User-specific connection to the Salesforce API.
 * Initialise by creating a connection `asUser` or `asSystemUser`.
 */
export class Api {
  private readonly version: string;
  private readonly instanceUrl: string;
  private readonly accessToken: string;
  private readonly logger: ILogger;
  public readonly email: string;

  constructor({
    version = "v59.0",
    instanceUrl,
    accessToken,
    email,
  }: {
    version?: string;
    instanceUrl: string;
    accessToken: string;
    email: string;
  }) {
    this.fetch = this.fetch.bind(this);
    this.version = version;
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
    this.email = email;
    this.logger = new Logger("Salesforce API", { prefixLines: [email] });
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
  public static async asUser(email: string) {
    const { accessToken, url } = await getCachedSalesforceAccessToken({
      clientId: configuration.salesforceServiceUser.clientId,
      connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      serviceUsername: configuration.salesforceServiceUser.serviceUsername,
      currentUsername: email,
    });

    return new Api({
      accessToken,
      instanceUrl: url,
      email,
    });
  }

  /**
   * Connect to Salesforce as the Salesforce System user
   *
   * @returns A connection to the Salesforce API as a system user.
   */
  public static asSystemUser() {
    return Api.asUser(configuration.salesforceServiceUser.serviceUsername);
  }

  private async fetch(input: string, init?: FetcherConfiguration) {
    const url = new URL(input, this.instanceUrl);

    if (init?.searchParams) {
      for (const [name, value] of Object.entries(init.searchParams)) {
        url.searchParams.set(name, value);
      }
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    const jsonAsText = await response.text();

    if (response.status !== 200) {
      let message = `Failed to fetch "${url.toString()}" (status code ${response.status})`;
      message += `Body:\n${jsonAsText}`;
      throw new Error(message);
    }

    try {
      let json = JSON.parse(jsonAsText);

      // TODO: See if Salesforce decides to not encode their JSON output.
      if (init?.decodeHTMLEntities) {
        json = mapStringInObject(json, decodeHTMLEntities);
      }

      return json;
    } catch (e) {
      this.logger.error("Failed to decode Salesforce JSON response", e, jsonAsText);
      throw new Error("Failed to decode JSON", { cause: e });
    }
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

    this.logger.debug("GraphQL Query", query, variables);
    // "graphql" is not part of the template string because our ESbuild/Relay GraphQL hack
    // does thinks our code is actually a query.
    const data = await this.fetch(`/services/data/${this.version}/` + "graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      decodeHTMLEntities,
    });

    if (data.errors.length) {
      this.logger.error("GraphQL Error", queryName, variables, data);
    } else {
      this.logger.debug("GraphQL Result", queryName, variables, data);
    }

    timer.finish();

    return data;
  }

  /**
   * Execute a SOQL Query via the Salesforce SOQL Query API.
   *
   * @returns SOQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  public async executeSOQL<T>({ query }: { query: string }): Promise<T> {
    this.logger.debug("SOQL Query", query);
    const timer = this.startTimer(query);
    const data = this.fetch(`/services/data/${this.version}/query`, {
      method: "GET",
      searchParams: {
        q: query,
      },
    });
    this.logger.debug("SOQL Query Return", query, await data);
    timer.finish();
    return data;
  }
}
