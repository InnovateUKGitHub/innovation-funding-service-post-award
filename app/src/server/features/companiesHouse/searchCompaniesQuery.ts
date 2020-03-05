import { QueryBase } from "../common";
import { IContext } from "@framework/types";
import { CompanyDto } from "@framework/dtos/companyDto";

export class SearchCompaniesQuery extends QueryBase<CompanyDto[]> {
  constructor(private readonly searchString: string, private readonly itemsPerPage?: number, private readonly startIndex?: number) {
    super();
  }

  protected Run(context: IContext): Promise<CompanyDto[]> {
    return context.resources.companiesHouse.searchCompany(this.searchString, this.itemsPerPage, this.startIndex);
  }
}
