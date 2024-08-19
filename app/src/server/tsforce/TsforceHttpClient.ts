import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { mapStringInObject } from "@shared/mapStringInObject";
import { decode as decodeHTMLEntities } from "html-entities";

interface FetcherConfiguration extends RequestInit {
  searchParams?: Record<string, string>;
  decodeHTMLEntities?: boolean;
}

class TsforceHttpClient {
  private readonly logger: ILogger;
  private readonly version: string;
  private readonly accessToken: string;
  private readonly instanceUrl: string;

  constructor({
    version,
    accessToken,
    instanceUrl,
    email,
    tid,
  }: {
    version: string;
    accessToken: string;
    instanceUrl: string;
    email: string;
    tid: string;
  }) {
    this.version = version;
    this.accessToken = accessToken;
    this.instanceUrl = instanceUrl;
    this.logger = new Logger("tsforce", { prefixLines: [{ email, tid }] });
  }

  private executeFetchRequest(input: string, init?: FetcherConfiguration) {
    const url = new URL(`/services/data/${this.version}${input}`, this.instanceUrl);

    if (init?.searchParams) {
      for (const [name, value] of Object.entries(init.searchParams)) {
        url.searchParams.set(name, value);
      }
    }

    return fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  public async fetchBlob(input: string, init?: FetcherConfiguration): Promise<ReadableStream<Uint8Array> | null> {
    const response = await this.executeFetchRequest(input, init);
    return response.body;
  }

  public async fetchJson(input: string, init?: FetcherConfiguration) {
    const response = await this.executeFetchRequest(input, init);
    const jsonAsText = await response.text();

    if (response.status !== 200) {
      let message = `Failed to fetch "${response.url}" (status code ${response.status})`;
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
      throw new Error("Failed to decode JSON");
    }
  }
}

export { TsforceHttpClient };
