import { TsforceInvalidUsernameException } from "@innovateuk/tsforce/index";
import { FetcherConfiguration, ITsforceHttpClient } from "@innovateuk/tsforce/types/ITsforceHttpClient";
import { APIRequestContext } from "@playwright/test";
import { Readable } from "node:stream";
import { ReadableStream } from "stream/web";

class PlaywrightTsforceHttpClient implements ITsforceHttpClient {
  private readonly accessToken?: string;
  private readonly instanceUrl: string;
  private readonly apiRequestContext: APIRequestContext;

  constructor({
    accessToken,
    instanceUrl,
    apiRequestContext,
  }: {
    accessToken?: string;
    instanceUrl: string;
    apiRequestContext: APIRequestContext;
  }) {
    this.accessToken = accessToken;
    this.instanceUrl = instanceUrl;
    this.apiRequestContext = apiRequestContext;
  }

  private executeFetchRequest(input: string, init: FetcherConfiguration = {}) {
    const url = `${this.instanceUrl}${input}`;
    return this.apiRequestContext.fetch(url, {
      ...init,
      params: init.searchParams,
      data: init.body,
      headers: {
        ...init?.headers,
        ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      },
    });
  }

  public async fetchBlob(input: string, init?: FetcherConfiguration): Promise<Readable> {
    const res = await this.executeFetchRequest(input, init);
    const buffer = await res.body();
    const blob = new Blob([buffer]);
    return Readable.fromWeb(blob.stream() as ReadableStream);
  }

  public async fetchText(input: string, init?: FetcherConfiguration): Promise<string> {
    const res = await this.executeFetchRequest(input, init);
    return res.text();
  }

  public async fetchJson(input: string, init?: FetcherConfiguration) {
    let data = await this.fetchText(input, init);

    try {
      if (init?.decodeHTMLEntities) {
        // JSON Safe Salesforce Decoding
        // https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/intro_encoding.htm
        data = data
          .replaceAll("&lt;", "<")
          .replaceAll("&gt;", ">")
          .replaceAll("&quot;", '\\"')
          .replaceAll("&#39;", "'")
          .replaceAll("&#92;", "\\\\")
          .replaceAll("&amp;", "&");
      }
      if (data.includes("<title>Down For Maintenance</title>")) throw new TsforceInvalidUsernameException();

      return JSON.parse(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export { PlaywrightTsforceHttpClient };
