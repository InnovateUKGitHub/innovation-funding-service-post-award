import { CompanyDto } from "@framework/dtos/companyDto";
import { IContext } from "@framework/types/IContext";
import { ICompaniesHouseParams } from "@server/resources/companiesHouse";
import { QueryBase } from "../common/queryBase";
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
