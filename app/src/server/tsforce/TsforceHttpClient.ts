import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import http, { IncomingMessage } from "node:http";
import https from "node:https";
import { Writable } from "node:stream";
import { decode as decodeHTMLEntities } from "html-entities";

interface FetcherConfiguration {
  searchParams?: Record<string, string>;
  decodeHTMLEntities?: boolean;
  headers?: Record<string, string>;
  method?: "POST" | "PUT" | "PATCH" | "GET" | "DELETE";
  body?: string;
  chunked?: boolean;
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
    return new Promise<IncomingMessage>((resolve, reject) => {
      const url = new URL(`/services/data/${this.version}${input}`, this.instanceUrl);
      const client = url.protocol === "https:" ? https : http;

      if (init?.searchParams) {
        for (const [name, value] of Object.entries(init.searchParams)) {
          url.searchParams.set(name, value);
        }
      }

      const req = client.request(
        url,
        {
          method: init?.method,
          headers: {
            ...init?.headers,
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
        resolve,
      );

      req.on("error", reject);

      if (init.chunked) {
        req.setHeader("transfer-encoding", "chunked");
        req.flushHeaders();
      }

      if (init.body) {
        req.write(init.body);
      }

      req.end();
    });
  }

  public async fetchBlob(input: string, init?: FetcherConfiguration): Promise<Writable> {
    const rs = new Writable();
    const res = await this.executeFetchRequest(input, init);
    res.pipe(rs);
    return rs;
  }

  public fetchJson(input: string, init?: FetcherConfiguration) {
    return this.executeFetchRequest(input, init).then(
      res =>
        new Promise((resolve, reject) => {
          const body: string[] = [];
          res.setEncoding("utf-8");
          res.on("data", chunk => {
            body.push(chunk);
          });
          res.on("error", err => {
            reject(err);
          });
          res.on("end", () => {
            try {
              let data = body.join("");
              if (init?.decodeHTMLEntities) data = decodeHTMLEntities(data);
              const obj = JSON.parse(data);
              resolve(obj);
            } catch (e) {
              reject(e);
            }
          });
        }),
    );
  }
}

export { TsforceHttpClient };
