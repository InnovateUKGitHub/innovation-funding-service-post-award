import { Dispatcher, request } from "undici";
import BodyReadable from "undici/types/readable";

type RequestOptions = Exclude<Parameters<typeof request>[1], undefined>;
interface FetcherConfiguration extends RequestOptions {
  searchParams?: Record<string, string>;
  decodeHTMLEntities?: boolean;
}

interface ITsforceHttpClient {
  fetchBlob(input: string, init?: FetcherConfiguration): Promise<BodyReadable & Dispatcher.BodyMixin>;
  fetchJson(input: string, init?: FetcherConfiguration): any;
}

export { FetcherConfiguration, ITsforceHttpClient };
