import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { Dispatcher, request } from "undici";
import { UnauthenticatedError } from "@shared/appError";
import BodyReadable from "undici/types/readable";

type RequestOptions = Exclude<Parameters<typeof request>[1], undefined>;
interface FetcherConfiguration extends RequestOptions {
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

  private executeFetchRequest(input: string, init: FetcherConfiguration = {}) {
    const url = new URL(`/services/data/${this.version}${input}`, this.instanceUrl);

    if (init?.searchParams) {
      for (const [name, value] of Object.entries(init.searchParams)) {
        url.searchParams.set(name, value);
      }
    }

    return request(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  public async fetchBlob(input: string, init?: FetcherConfiguration): Promise<BodyReadable & Dispatcher.BodyMixin> {
    const res = await this.executeFetchRequest(input, init);
    return res.body;
  }

  public async fetchJson(input: string, init?: FetcherConfiguration) {
    const { body } = await this.executeFetchRequest(input, init);

    let data = await body.text();

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
      if (data.includes("<title>Down For Maintenance</title>")) throw new UnauthenticatedError();

      return JSON.parse(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export { TsforceHttpClient };
