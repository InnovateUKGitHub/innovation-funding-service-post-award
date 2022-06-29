import { configuration, ConfigurationError } from "@server/features/common";

export interface ICompaniesHouseParams {
  searchString: string;
  itemsPerPage?: number;
  startIndex?: number;
}

export class CompaniesHouseBase {
  private getUrl(endpointSegment: string, inboundParams?: Record<string, string>): string {
    const { companiesHouse } = configuration;

    if (!companiesHouse.accessToken) {
      throw new ConfigurationError("'companiesHouse.accessToken' has not been set!");
    }

    if (!companiesHouse.endpoint) {
      throw new ConfigurationError("'companiesHouse.endpoint' has not been set!");
    }

    const apiEndpoint = `${companiesHouse.endpoint}${endpointSegment}`;

    if (!inboundParams) return apiEndpoint;

    const parsedParams = new URLSearchParams(inboundParams);

    return `${apiEndpoint}?${parsedParams.toString()}`;
  }

  public async queryCompaniesHouse<T>(url: string, searchParams?: Record<string, string>): Promise<T> {
    try {
      const parsedUrl = this.getUrl(url, searchParams);

      const fetchQuery = await fetch(parsedUrl, {
        headers: {
          Authorization: configuration.companiesHouse.accessToken,
        },
      });

      if (!fetchQuery.ok) {
        throw new Error(fetchQuery.statusText || "Bad Companies House request. Failed to get a positive response.");
      }

      return await fetchQuery.json();
    } catch (err: any) {
      // Note: Add specific api failures here

      if (err?.message?.includes("socket hang up")) {
        // Note: Add this point we know to contact develop/escalate
        throw new Error("COMPANIES_HOUSE_WHITELIST_ISSUE");
      }

      throw new Error(err);
    }
  }
}

export type ICompaniesHouseBase = Pick<CompaniesHouseBase, "queryCompaniesHouse">;
