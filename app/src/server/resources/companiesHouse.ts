import { configuration } from "@server/features/common/config";
import { mtlsFetchAgent } from "./mtlsFetchAgent";
import { fetch } from "undici";

export interface ICompaniesHouseParams {
  searchString: string;
  itemsPerPage?: number;
  startIndex?: number;
}

export abstract class ICompaniesHouseBase {
  protected abstract queryCompaniesHouse<T>(url: string, searchParams?: Record<string, string>): Promise<T>;
}

export class CompaniesHouseBase extends ICompaniesHouseBase {
  private getUrl(endpointSegment: string, inboundParams?: Record<string, string>): string {
    const hydraUrl = configuration?.certificates?.hydraMtls?.serverName ?? "unknown";

    const apiEndpoint = `${hydraUrl}${endpointSegment}`;

    if (!inboundParams) return apiEndpoint;

    const parsedParams = new URLSearchParams(inboundParams);

    return `${apiEndpoint}?${parsedParams.toString()}`;
  }

  protected async queryCompaniesHouse<T>(url: string, searchParams?: Record<string, string>): Promise<T> {
    const parsedUrl = this.getUrl(url, searchParams);
    const res = await fetch(parsedUrl, { dispatcher: mtlsFetchAgent });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text ?? "Bad Companies House request. Failed to get a positive response.");
    }

    return (await res.json()) as Promise<T>;
  }
}
