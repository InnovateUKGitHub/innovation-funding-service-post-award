import { ICompanyHouse } from "@framework/entities/CompanyHouse";
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
    items: ICompanyHouse[];
  };
}

export class CompaniesHouse extends CompaniesHouseBase {
  constructor() {
    super();
  }

  public async searchCompany(apiParams: ICompaniesHouseParams): Promise<ICompanyHouse[]> {
    // Note: Start checking params and there validity here
    if (!apiParams.searchString.length) {
      throw new BadRequestError("Missing a searchString param!");
    }

    if (apiParams.itemsPerPage && !withinRange(apiParams.itemsPerPage, 1, 1000)) {
      throw new BadRequestError(`Param itemsPerPage '${apiParams.itemsPerPage}' needs to be within 1 - 1000.`);
    }

    const params: Record<string, string> = { searchString: apiParams.searchString };

    if (apiParams.itemsPerPage) params.items_per_page = String(apiParams.itemsPerPage);
    if (apiParams.startIndex) params.start_index = String(apiParams.startIndex);

    const data = await this.queryCompaniesHouse<ICompanyHouseResponse>("/companies-house/search", params);

    return data.results.items;
  }
}

export type ICompaniesHouse = Pick<CompaniesHouse, "searchCompany">;
