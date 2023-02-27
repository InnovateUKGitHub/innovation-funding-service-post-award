import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { configuration } from "@server/features/common";
import { getCachedSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { Logger } from "@shared/developmentLogger";
import { print } from "graphql";
import { decode as decodeHTMLEntities } from "html-entities";
import fetch from "isomorphic-fetch";

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
  private readonly logger: Logger = new Logger("Salesforce");
  public readonly email: string;

  constructor({
    version = "v56.0",
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
  }

  /**
   * Connect to Salesforce with a username
   *
   * @param email The username/email address of the user.
   * @returns A user-specific connection to the Salesforce API.
   */
  public static async asUser(email: string) {
    const { accessToken, url } = await getCachedSalesforceAccessToken({
      // const { accessToken, url } = await getSalesforceAccessToken({
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

    let jsonAsText = await response.text();

    // Decode Salesforce HTML Entities.
    if (init?.decodeHTMLEntities) {
      // Ensure quotes are escaped with a "\".
      jsonAsText = jsonAsText.replaceAll("&quot;", '\\"');
      jsonAsText = jsonAsText.replaceAll("&#34;", '\\"');

      // Decode all other HTML entities.
      jsonAsText = decodeHTMLEntities(jsonAsText);
    }

    if (response.status !== 200) {
      let message = `Failed to fetch "${url.toString()}" (status code ${response.status})`;
      message += `Body:\n${JSON.stringify(jsonAsText)}`;
      throw new Error(message);
    }

    try {
      // TODO: See if Salesforce decides to not encode their JSON output.
      const json = JSON.parse(jsonAsText);
      return json;
    } catch {
      this.logger.error("Failed to decode Salesforce GraphQL JSON response", jsonAsText);
      throw new Error("Failed to decode JSON");
    }
  }

  /**
   * Execute a GraphQL Query AST via the Salesforce GraphQL API.
   *
   * @todo Remove decodeHTMLEntities when Salesforce no longer returns encoded results.
   * @returns GraphQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  public executeGraphQL<T>({
    document,
    variables,
    decodeHTMLEntities,
  }: ExecutionRequest & ExecuteConfiguration): Promise<T> {
    const query = print(document);
    this.logger.debug("Query", query, variables);
    return this.fetch(`/services/data/${this.version}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      decodeHTMLEntities,
    });
  }
}
