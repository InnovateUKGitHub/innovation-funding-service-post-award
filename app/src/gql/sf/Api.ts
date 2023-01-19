import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { configuration } from "@server/features/common";
import { getCachedSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { print } from "graphql";
import fetch from "isomorphic-fetch";

interface FetcherConfiguration extends RequestInit {
  searchParams?: Record<string, string>;
}

/**
 * User-specific connection to the Salesforce API.
 * Initialise by creating a connection `asUser` or `asSystemUser`.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
export class Api {
  private readonly version: string;
  private readonly instanceUrl: string;
  private readonly accessToken: string;
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

    const res = await response.json();

    if (response.status !== 200) {
      let message = `Failed to fetch "${url.toString()}" (status code ${response.status})`;
      message += `Body:\n${JSON.stringify(res)}`;
      throw new Error(message);
    }

    return res;
  }

  /**
   * Execute a GraphQL Query AST via the Salesforce GraphQL API.
   *
   * @returns GraphQL Result - Is typed as `any` because the result may vary, including potential errors.
   */
  public executeGraphQL({ document, variables }: ExecutionRequest) {
    const query = print(document);
    return this.fetch(`/services/data/${this.version}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
  }
}
