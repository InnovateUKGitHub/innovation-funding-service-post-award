import { ICompaniesHouseResponse } from "@framework/entities/CompanyHouse";
import { withinRange } from "@framework/util/numberHelper";

import { CompaniesHouseBase } from "@server/resources/companiesHouse";
import { BadRequestError } from "@shared/appError";

export interface ICompaniesHouseParams {
  searchString: string;
  itemsPerPage?: number;
  startIndex?: number;
}

interface ICompanyHouseResponse {
  message: unknown;
  results: {
    items: ICompaniesHouseResponse[] | null;
  };
}

export abstract class ICompaniesHouse extends CompaniesHouseBase {
  public abstract searchCompany(apiParams: ICompaniesHouseParams): Promise<ICompaniesHouseResponse[]>;
}

export class CompaniesHouse extends ICompaniesHouse {
  public async searchCompany(apiParams: ICompaniesHouseParams): Promise<ICompaniesHouseResponse[]> {
    // Note: Start checking params and there validity here
    if (!apiParams.searchString.length) {
      throw new BadRequestError("Search query must have 1 character or greater.");
    }

    if (apiParams.itemsPerPage && !withinRange(apiParams.itemsPerPage, 1, 1000)) {
      throw new BadRequestError(`Param itemsPerPage '${apiParams.itemsPerPage}' needs to be within 1 - 1000.`);
    }

    const params: Record<string, string> = { searchString: apiParams.searchString };

    if (typeof apiParams.itemsPerPage === "number") params.items_per_page = String(apiParams.itemsPerPage);
    if (typeof apiParams.startIndex === "number") params.start_index = String(apiParams.startIndex);

    const data = await this.queryCompaniesHouse<ICompanyHouseResponse>("/companies-house/search", params);

    return data.results?.items ?? [];
  }
}

export const companiesHouse = new CompaniesHouse();
