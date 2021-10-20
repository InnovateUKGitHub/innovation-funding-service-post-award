import { IContext } from "@framework/types";

import { CompanyDto } from "@framework/dtos/companyDto";

import { QueryBase } from "@server/features/common";
import { ICompaniesHouseParams } from "@server/resources/companiesHouse";

import { mapCompaniesHouse } from "./mapCompaniesHouse";

export class SearchCompaniesQuery extends QueryBase<CompanyDto[]> {
  constructor(private readonly queryParams: ICompaniesHouseParams) {
    super();
  }

  protected async run(context: IContext): Promise<CompanyDto[]> {
    const companiesResults = await context.repositories.companies.searchCompany(this.queryParams);

    return companiesResults.map(mapCompaniesHouse);
  }
}
