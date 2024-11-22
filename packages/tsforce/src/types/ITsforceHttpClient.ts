import type { Readable } from "node:stream";

interface FetcherConfiguration {
  method?: "GET" | "HEAD" | "PATCH" | "POST" | "PUT";
  searchParams?: Record<string, string>;
  decodeHTMLEntities?: boolean;
  headers?: Record<string, string>;
  body?: string | Buffer;
}

interface ITsforceHttpClient {
  fetchBlob(input: string, init?: FetcherConfiguration): Promise<Readable>;
  fetchText(input: string, init?: FetcherConfiguration): Promise<string>;
  fetchJson(input: string, init?: FetcherConfiguration): Promise<any>;
}

export { FetcherConfiguration, ITsforceHttpClient };
