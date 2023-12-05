import { configuration } from "@server/features/common/config";
import { isError } from "util";

export interface ICompaniesHouseParams {
  searchString: string;
  itemsPerPage?: number;
  startIndex?: number;
}

export class CompaniesHouseBase {
  private getUrl(endpointSegment: string, inboundParams?: Record<string, string>): string {
    const { sil } = configuration;

    const apiEndpoint = `${sil.url}${endpointSegment}`;

    if (!inboundParams) return apiEndpoint;

    const parsedParams = new URLSearchParams(inboundParams);

    return `${apiEndpoint}?${parsedParams.toString()}`;
  }

  public async queryCompaniesHouse<T>(url: string, searchParams?: Record<string, string>): Promise<T> {
    try {
      const parsedUrl = this.getUrl(url, searchParams);

      const fetchQuery = await fetch(parsedUrl);

      if (!fetchQuery.ok) {
        throw new Error(fetchQuery.statusText || "Bad Companies House request. Failed to get a positive response.");
      }

      return await fetchQuery.json();
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

export type ICompaniesHouseBase = Pick<CompaniesHouseBase, "queryCompaniesHouse">;
