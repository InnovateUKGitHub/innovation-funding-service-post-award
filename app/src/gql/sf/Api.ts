import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { configuration } from "@server/features/common";
import { getSalesforceAccessToken } from "@server/repositories/salesforceConnection";
import { Logger } from "@shared/developmentLogger";
import { print } from "graphql";
import fetch from "isomorphic-fetch";

interface FetcherConfiguration extends RequestInit {
  searchParams?: Record<string, string>;
}

export class Api {
  private readonly version: string;
  private readonly instanceUrl: string;
  private readonly accessToken: string;
  private readonly logger: Logger;
  public readonly email: string;

  private constructor({
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
    this.logger = new Logger("SfGqlApi", { prefixLines: [email] });
  }

  public static async asUser(email: string) {
    const { accessToken, url } = await getSalesforceAccessToken({
      clientId: configuration.salesforceServiceUser.clientId,
      connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      currentUsername: email,
    });

    return new Api({
      accessToken,
      instanceUrl: url,
      email,
    });
  }

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

  public executeGraphQL({ document, variables }: ExecutionRequest) {
    const query = print(document);
    return this.fetch(`/services/data/${this.version}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
  }
}
