import { CompanyDto } from "@framework/dtos/companyDto";
import { IContext } from "@framework/types/IContext";
import { ICompaniesHouseParams } from "@server/resources/companiesHouse";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { mapCompaniesHouse } from "../../repositories/mapCompaniesHouse";

export class SearchCompaniesQuery extends AuthorisedAsyncQueryBase<CompanyDto[]> {
  public readonly runnableName: string = "SearchCompaniesQuery";
  constructor(private readonly queryParams: ICompaniesHouseParams) {
    super();
  }

  protected async run(context: IContext): Promise<CompanyDto[]> {
    const companiesResults = await context.repositories.companies.searchCompany(this.queryParams);

    return companiesResults.map(mapCompaniesHouse);
  }
}
