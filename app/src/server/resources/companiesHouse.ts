import { configuration } from "@server/features/common/config";
import { mtlsFetchAgent } from "./mtlsFetchAgent";
import { fetch } from "undici";
import { isError } from "util";

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
    const { sil } = configuration;

    const apiEndpoint = `${sil.url}${endpointSegment}`;

    if (!inboundParams) return apiEndpoint;

    const parsedParams = new URLSearchParams(inboundParams);

    return `${apiEndpoint}?${parsedParams.toString()}`;
  }

  protected async queryCompaniesHouse<T>(url: string, searchParams?: Record<string, string>): Promise<T> {
    try {
      const parsedUrl = this.getUrl(url, searchParams);

      const fetchQuery = await fetch(parsedUrl, { dispatcher: mtlsFetchAgent });

      if (!fetchQuery.ok) {
        throw new Error((await fetchQuery.text()) || "Bad Companies House request. Failed to get a positive response.");
      }

      return (await fetchQuery.json()) as Promise<T>;
    } catch (err: unknown) {
      // Note: Add specific api failures here

      if (isError(err)) {
        if (err?.message?.includes("socket hang up")) {
          // Note: Add this point we know to contact develop/escalate
          throw new Error("COMPANIES_HOUSE_WHITELIST_ISSUE");
        }

        throw new Error(err.message);
      }

      throw new Error(String(err));
    }
  }
}
