import { ICompanyHouse, ICompanyHouseCompanyStatus } from "@framework/entities/CompanyHouse";
import { withinRange } from "@framework/util/numberHelper";

import { CompaniesHouseBase } from "@server/resources/companiesHouse";
import { BadRequestError } from "@shared/appError";

export interface ICompaniesHouseParams {
  searchString: string;
  itemsPerPage?: number;
  startIndex?: number;
}

interface ICompanyHouseResponse {
  kind: string;
  items_per_page: number;
  start_index: number;
  total_results: number;
  etag?: string;
  items?: ICompanyHouse[];
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

    const params: Record<string, string> = { q: apiParams.searchString };

    if (apiParams.itemsPerPage) params.items_per_page = String(apiParams.itemsPerPage);
    if (apiParams.startIndex) params.start_index = String(apiParams.startIndex);

    const { items: companies } = await this.queryCompaniesHouse<ICompanyHouseResponse>("/search/companies", params);

    if (!companies?.length) return [];

    const allowedCompanies: ICompanyHouseCompanyStatus[] = ["voluntary-arrangement", "active"];

    return companies.filter(x => {
      const hasCompanyNumber = !!x.company_number;
      const isValidCompany = allowedCompanies.includes(x.company_status);

      return hasCompanyNumber && isValidCompany;
    });
  }
}

export type ICompaniesHouse = Pick<CompaniesHouse, "searchCompany">;
